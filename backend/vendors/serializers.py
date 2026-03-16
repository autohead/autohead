from rest_framework import serializers
from .models import Vendors
from product.models import VendorProducts
from product.serializers import ProductBriefSerializer, VendorBriefSerializer


class VendorProductSerializer(serializers.ModelSerializer):
    vendor_detail = VendorBriefSerializer(read_only=True, source="vendor")
    product_detail = ProductBriefSerializer(read_only=True, source="product")

    class Meta:
        model = VendorProducts
        fields = "__all__"
        read_only_fields = ["id", "created_at", "updated_at", "product"]


# All crud serializer for Vendor model
class VendorSerializer(serializers.ModelSerializer):
    vendor_products = VendorProductSerializer(many=True, read_only=True)

    class Meta:
        model = Vendors
        fields = ['id', 'name', 'phone', 'vendor_products']
        read_only_fields = ["id", "created_at", "updated_at", "vendor_products"]
        
        

    # def create(self, validated_data):
    #     vendor = Vendors.objects.create(**validated_data)
    #     return vendor

    # def update(self, instance, validated_data):

    #     for attr, value in validated_data.items():
    #         setattr(instance, attr, value)
    #     instance.save()

    #     return instance
