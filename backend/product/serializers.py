from rest_framework import serializers
from .models import Products, VendorProducts
from vendors.models import Vendors
from category.models import Category
from django.db import transaction
import cloudinary.uploader


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


class ProductBriefSerializer(serializers.ModelSerializer):
    class Meta:
        model = Products
        fields = ["id", "product_name"]


class VendorProductSerializer(serializers.ModelSerializer):
    vendor_detail = VendorBriefSerializer(read_only=True, source="vendor")

    class Meta:
        model = VendorProducts
        fields = "__all__"
        read_only_fields = ["id", "created_at", "updated_at", "product"]


class ProductSerializer(serializers.ModelSerializer):

    category_detail = CategoryBriefSerializer(source="category", read_only=True)
    stock_count = serializers.IntegerField(read_only=True)
    # Nested read-only representation of vendor_products corresponding to this product
    vendor_products = VendorProductSerializer(many=True, read_only=True)
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Products
        fields = "__all__"
        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
            "is_active",
            "stock_count",
            "image_url",
        ]

    def get_image_url(self, obj):
        if obj.image:
            return obj.image.url


class ProductFormSerializer(serializers.ModelSerializer):

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

        if (
            Products.objects.filter(category=Category, product_name=product_name)
            .exclude(pk=self.instance.pk if self.instance else None)
            .exists()
        ):
            raise serializers.ValidationError(
                "A product with this name already exists in this category."
            )

        return attrs

    @transaction.atomic
    def create(self, validated_data):
        product = Products.objects.create(**validated_data)
        return product

    @transaction.atomic
    def update(self, instance, validated_data):

        new_image = validated_data.get("image", None)

        if new_image and instance.image:
            # Delete old image from Cloudinary
            public_id = instance.image.public_id
            cloudinary.uploader.destroy(public_id)

        # --- Update Product fields ---
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        return instance


# Serializer for VendorProducts used in product forms (create/update).


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

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        return instance
