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
            "image_url"
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




# vendor = serializers.PrimaryKeyRelatedField(
    #     queryset=Vendors.objects.all(), write_only=True
    # )

    # vendor_code = serializers.CharField(write_only=True)
    # price = serializers.DecimalField(max_digits=10, decimal_places=2, write_only=True)
    # cost = serializers.DecimalField(max_digits=10, decimal_places=2, write_only=True)
    # stock = serializers.IntegerField(write_only=True)

# def create(self, validated_data):

    #     vendor = validated_data.pop("vendor")
    #     vendor_code = validated_data.pop("vendor_code")
    #     price = validated_data.pop("price")
    #     cost = validated_data.pop("cost")
    #     stock = validated_data.pop("stock")

    #     product = Products.objects.create(**validated_data)
    #     VendorProducts.objects.create(
    #         product=product,
    #         vendor=vendor,
    #         vendor_code=vendor_code,
    #         price=price,
    #         cost=cost,
    #         stock=stock,
    #         is_active=True,
    #     )
    #     return product
    
    
    
    #update
    # # --- VendorProducts fields ---
        # vendor = validated_data.pop("vendor", None)
        # vendor_code = validated_data.pop("vendor_code", None)
        # price = validated_data.pop("price", None)
        # cost = validated_data.pop("cost", None)
        # stock = validated_data.pop("stock", None)
        

        # --- Update VendorProducts if vendor data is provided ---
        # if vendor:
        #     vendor_product = VendorProducts.objects.filter(
        #         product=instance, vendor=vendor
        #     ).first()

        #     updates = {
        #         "vendor_code": vendor_code,
        #         "price": price,
        #         "cost": cost,
        #         "stock": stock,
        #     }

        #     if vendor_product:
        #         for field, value in updates.items():
        #             if value is not None:
        #                 setattr(vendor_product, field, value)

        #         vendor_product.save()
        
          # --- IMAGE HANDLING ---