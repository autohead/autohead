from rest_framework import serializers
from .models import Products, VendorProducts
from vendors.models import Vendors
from django.db import transaction


# Lightweight serializers used for nested read-only representation.
# These serializers expose only 'id' and 'name' to avoid unnecessary payload
# and prevent deep nesting inside ProductSerializer.


class VendorBriefSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vendors
        fields = ["id", "name"]


class ProductBriefSerializer(serializers.ModelSerializer):
    class Meta:
        model = Products
        fields = ["id", "product_name"]


class VendorProductBriefSerializer(serializers.ModelSerializer):
    vendor_detail = VendorBriefSerializer(read_only=True, source="vendor")

    class Meta:
        model = VendorProducts
        fields = ["id", "vendor", "stock", "product", "vendor_detail", "price"]


class VendorProductSerializer(serializers.ModelSerializer):
    vendor_detail = VendorBriefSerializer(read_only=True, source="vendor")

    class Meta:
        model = VendorProducts
        fields = "__all__"
        read_only_fields = ["id", "created_at", "updated_at", "product"]


class ProductSerializer(serializers.ModelSerializer):

    stock_supplied = serializers.IntegerField(read_only=True)
    # Nested read-only representation of vendor_products corresponding to this product
    vendor_products = VendorProductSerializer(many=True, read_only=True)

    class Meta:
        model = Products
        fields = "__all__"
        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
            "is_active",
            "stock_supplied",
        ]


class ProductItemSerializer(serializers.Serializer):
    product_name = serializers.CharField()
    product_code = serializers.CharField()
    stock = serializers.IntegerField()
    cost = serializers.DecimalField(max_digits=10, decimal_places=2)
    selling_price = serializers.DecimalField(max_digits=10, decimal_places=2)


class VendorSerializer(serializers.Serializer):
    name = serializers.CharField()
    phone = serializers.CharField()


class ProductFormSerializer(serializers.Serializer):

    vendor_data = VendorSerializer(required=False)
    product_data = ProductItemSerializer(many=True)

    def validate(self, attrs):
        products = attrs.get("product_data", [])

        codes = [p["product_code"] for p in products]

        if len(codes) != len(set(codes)):
            raise serializers.ValidationError("Duplicate product codes in request.")

        return attrs

    @transaction.atomic
    def create(self, validated_data):
        vendor = None
        products_data = validated_data.pop("product_data", [])
        vendor_data = validated_data.pop("vendor_data", None)

        # check and create vendor if not exists
        if vendor_data:
            vendor, _ = Vendors.objects.get_or_create(**vendor_data)
            
        last_product = None

        for item in products_data:
            product, created = Products.objects.get_or_create(
                product_code=item["product_code"],
                defaults={
                    "product_name": item["product_name"],
                    "price": item["selling_price"],
                    "cost": item["cost"],
                },
            )

            new_stock = item["stock"]
            old_stock = product.stock
            difference = new_stock - old_stock
            product.stock += difference

            
            if not created:
                product.price = item["selling_price"]
                product.cost = item["cost"]
            product.save()

            if vendor and difference > 0:
                VendorProducts.objects.update_or_create(
                    vendor=vendor,
                    product=product,
                    defaults={"stock_supplied": new_stock, "cost": item["cost"]},
                )
            last_product = product
        return last_product


# Serializer for VendorProducts used in product forms (create/update)


class VendorProductRead(serializers.ModelSerializer):
    vendor_detail = VendorBriefSerializer(read_only=True, source="vendor")
    product_detail = ProductBriefSerializer(read_only=True, source="product")

    class Meta:
        model = VendorProducts
        fields = "__all__"
        read_only_fields = ["id", "created_at", "updated_at"]


class VendorProductFormSerializer(serializers.ModelSerializer):
    vendor = serializers.PrimaryKeyRelatedField(
        queryset=Vendors.objects.all(), write_only=True
    )

    product = serializers.PrimaryKeyRelatedField(
        queryset=Products.objects.all(), write_only=True
    )

    class Meta:
        model = VendorProducts
        fields = "__all__"
        read_only_fields = ["id", "created_at", "updated_at"]

        validators = [
            serializers.UniqueTogetherValidator(
                queryset=VendorProducts.objects.all(),
                fields=["vendor", "vendor_code"],
                message="This vendor code already exists for this vendor.",
            ),
            serializers.UniqueTogetherValidator(
                queryset=VendorProducts.objects.all(),
                fields=["vendor", "product"],
                message="This vendor already has this product.",
            ),
        ]

    def validate(self, attrs):
        cost = attrs.get("cost")
        selling_price = attrs.get("price")

        if selling_price and cost and cost > selling_price:
            raise serializers.ValidationError(
                "Cost cannot be greater than selling price."
            )

        return attrs

    @transaction.atomic
    def create(self, validated_data):
        vendor_product = VendorProducts.objects.create(**validated_data)
        return vendor_product

    @transaction.atomic
    def update(self, instance, validated_data):

        if "stock" in validated_data:
            stock_delta = validated_data.pop("stock")
            new_stock = instance.stock + stock_delta

            if new_stock < 0:
                raise serializers.ValidationError(
                    {"stock": "Stock cannot be negative."}
                )

            instance.stock = new_stock

        # ✅ Update allowed fields normally
        for field in ["price", "cost", "vendor_code"]:
            if field in validated_data:
                setattr(instance, field, validated_data[field])

        instance.save()
        return instance


# Serializer for product sales analysis response
class ProductSalesAnalysisSerializer(serializers.Serializer):
    productId = serializers.IntegerField()
    total_sales = serializers.IntegerField()
    total_revenue = serializers.DecimalField(decimal_places=2, max_digits=12)
    this_month_sales = serializers.IntegerField()
    last_2day_sales = serializers.IntegerField()
