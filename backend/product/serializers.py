from rest_framework import serializers
from .models import Products, VendorProducts
from vendors.models import Vendors
from category.models import Category
from django.db import transaction


# Lightweight serializers used for nested read-only representation.
# These serializers expose only 'id' and 'name' to avoid unnecessary payload
# and prevent deep nesting inside ProductSerializer.
class CategoryBriefSerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name"]


class VendorBriefSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vendors
        fields = ["id", "name"]


class VendorProductSerializer(serializers.ModelSerializer):
    vendor_detail = VendorBriefSerializer(read_only=True, source="vendor")

    class Meta:
        model = VendorProducts
        fields = "__all__"
        read_only_fields = ["id", "created_at", "updated_at", "product"]


class ProductSerializer(serializers.ModelSerializer):

    category_detail = CategoryBriefSerializer(source="category", read_only=True)
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
        ]


class ProductFormSerializer(serializers.ModelSerializer):

    vendor = serializers.PrimaryKeyRelatedField(
        queryset=Vendors.objects.all(), write_only=True
    )

    vendor_code = serializers.CharField(write_only=True)
    price = serializers.DecimalField(max_digits=10, decimal_places=2, write_only=True)
    cost = serializers.DecimalField(max_digits=10, decimal_places=2, write_only=True)
    stock = serializers.IntegerField(write_only=True)

    category = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.filter(is_active=True).all(), write_only=True
    )

    class Meta:
        model = Products
        fields = "__all__"
        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
            "is_active",
        ]

    def validate(self, attrs):
        Category = attrs.get("category")
        product_name = attrs.get("product_name")
        vendor = attrs.get("vendor")
        vendor_code = attrs.get("vendor_code")
        selling_price = attrs.get("price")
        cost_price = attrs.get("cost")

        if selling_price < cost_price:
            raise serializers.ValidationError(
                "Selling price cannot be less than cost price."
            )

        if (
            Products.objects.filter(category=Category, product_name=product_name)
            .exclude(pk=self.instance.pk if self.instance else None)
            .exists()
        ):
            raise serializers.ValidationError(
                "A product with this name already exists in this category."
            )

        if (
            VendorProducts.objects.filter(vendor_code=vendor_code, vendor=vendor)
            .exclude(pk=self.instance.pk if self.instance else None)
            .exists()
        ):
            raise serializers.ValidationError(
                "A product with this vendor code already exists for this vendor."
            )

        if selling_price <= cost_price:
            raise serializers.ValidationError(
                "Selling price cannot be less than or equal to cost price."
            )

        return attrs

    @transaction.atomic
    def create(self, validated_data):

        vendor = validated_data.pop("vendor")
        vendor_code = validated_data.pop("vendor_code")
        price = validated_data.pop("price")
        cost = validated_data.pop("cost")
        stock = validated_data.pop("stock")

        product = Products.objects.create(**validated_data)
        VendorProducts.objects.create(
            product=product,
            vendor=vendor,
            vendor_code=vendor_code,
            price=price,
            cost=cost,
            stock=stock,
            is_active=True,
        )
        return product

    @transaction.atomic
    def update(self, instance, validated_data):
        # --- VendorProducts fields ---
        vendor = validated_data.pop("vendor", None)
        vendor_code = validated_data.pop("vendor_code", None)
        price = validated_data.pop("price", None)
        cost = validated_data.pop("cost", None)
        stock = validated_data.pop("stock", None)

        # --- Update Product fields ---
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # --- Update VendorProducts if vendor data is provided ---
        if vendor:
            vendor_product = VendorProducts.objects.filter(
                product=instance, vendor=vendor
            ).first()

            updates = {
                "vendor_code": vendor_code,
                "price": price,
                "cost": cost,
                "stock": stock,
            }

            if vendor_product:
                for field, value in updates.items():
                    if value is not None:
                        setattr(vendor_product, field, value)

                vendor_product.save()
        return instance
