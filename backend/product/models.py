from django.db import models
from category.models import Category
from vendors.models import Vendors




# Create your models here.

class Products(models.Model):
    product_name = models.CharField(max_length=255)
    product_code = models.CharField(max_length=100, unique=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    stock = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    
    class Meta:
        db_table = 'products'
        
    def __str__(self):
        return self.product_name
                
class VendorProducts(models.Model):
    product = models.ForeignKey(Products, on_delete=models.CASCADE , related_name='vendor_products' )
    vendor = models.ForeignKey(Vendors, on_delete=models.CASCADE, related_name='vendor_products' )
    stock_supplied = models.PositiveIntegerField(default=0)
    cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    
    class Meta:
        db_table = "vendor_products"
        constraints = [
            models.UniqueConstraint(
                fields=["vendor", "product"],
                name="unique_vendor_product"
            ),
        ]
    
    def __str__(self):
        return f"{self.product.product_name} - {self.vendor.name}"
    
   
        
        