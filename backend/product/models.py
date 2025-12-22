from django.db import models
from category.models import Category
from vendors.models import Vendors
# from django.core.files.storage import default_storage
from cloudinary.models import CloudinaryField



# Create your models here.

class Products(models.Model):
    product_name = models.CharField(max_length=255)
    product_code = models.CharField(max_length=100, unique=True)
    description = models.TextField(null=True, blank=True)
    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name='products',  null=False)
    
    is_active = models.BooleanField(default=True)
    image = CloudinaryField('image',folder='authohead/product_images/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    
    class Meta:
        db_table = 'products'
        
        #unique product per category
        constraints = [
            models.UniqueConstraint(
                fields=["product_name", "category"],
                name="unique_product_per_category"
            )
        ]
        
    def __str__(self):
        return self.name
        
    #delete old Image
    # def save(self, *args, **kwargs):
    #     old_image = None

    #     if self.pk:
    #         try:
    #             old_image = Products.objects.get(pk=self.pk).image
    #         except Products.DoesNotExist:
    #             pass
            
    #     super().save(*args, **kwargs)

    #     if old_image and old_image != self.image:
    #         if default_storage.exists(old_image.name):
    #             default_storage.delete(old_image.name)
                
                
class VendorProducts(models.Model):
    product = models.ForeignKey(Products, on_delete=models.CASCADE , related_name='vendor_products' )
    vendor = models.ForeignKey(Vendors, on_delete=models.CASCADE)
    vendor_code = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    stock = models.PositiveIntegerField(default=0)
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
            models.UniqueConstraint(
                fields=["vendor", "vendor_code"],
                name="unique_vendor_code"
            )
        ]
    
    def __str__(self):
        return f"{self.product.name} - {self.vendor.name}"
    
   
        
        