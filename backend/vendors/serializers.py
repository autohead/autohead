from rest_framework import serializers
from .models import Vendors, Bank
from product.models import VendorProducts
from product.serializers import ProductBriefSerializer, VendorBriefSerializer


class VendorProductSerializer(serializers.ModelSerializer):
    vendor_detail = VendorBriefSerializer(read_only=True, source="vendor")
    product_detail = ProductBriefSerializer(read_only=True, source="product")
    class Meta:
        model = VendorProducts
        fields = "__all__"
        read_only_fields = ["id", "created_at", "updated_at", "product"]


class BankSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bank
        fields = ['id', 'bank_name', 'branch_name', 'account_number', 'ifsc_code', 'is_active', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']  
         
        
        
class VendorSerializer(serializers.ModelSerializer):
    bank= BankSerializer(required=False)
    vendor_products = VendorProductSerializer(many=True, read_only=True)
   
    class Meta:
        model = Vendors
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']
        
    def create(self, validated_data):
        bank_data = validated_data.pop('bank', None)
        
        vendor = Vendors.objects.create(**validated_data)
        if bank_data:
            Bank.objects.create(vendor=vendor, **bank_data)
        return vendor
    
    def update(self, instance, validated_data):
        bank_data = validated_data.pop('bank', None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        #  update or create bank
        if bank_data:
            Bank.objects.update_or_create(
                vendor=instance,
                defaults=bank_data
            )
        return instance