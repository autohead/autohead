from django.db import models
from product.models import VendorProducts

# Create your models here.
class Bill(models.Model):
    invoice_no = models.CharField(max_length=50, unique=True)
    customer_name = models.CharField(max_length=150, blank=True, null=True)
    net_amount = models.DecimalField(max_digits=12, decimal_places=2)
    discount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_amount = models.DecimalField(max_digits=12, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.invoice_no
    class Meta:
        db_table = "bills"
        
        
class BillItem(models.Model):
    bill = models.ForeignKey(
        Bill,
        on_delete=models.CASCADE,
        related_name="items"
    )
    vendor_product = models.ForeignKey(
        VendorProducts,
        on_delete=models.PROTECT
    )

    quantity = models.PositiveIntegerField()
    selling_price = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.bill.invoice_no} - {self.vendor_product}"
