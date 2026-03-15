from django.db import models
from product.models import Products

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

    # Override save method to auto-generate invoice_no if not provided
    def save(self, *args, **kwargs):
        if not self.invoice_no:
            # Use the DB id to guarantee uniqueness
            super().save(*args, **kwargs)  # save first to get ID
            self.invoice_no = f"INV{self.id:05d}"
            return super().save(update_fields=["invoice_no"])

        super().save(*args, **kwargs)
        
        
class BillItem(models.Model):
    bill = models.ForeignKey(
        Bill,
        on_delete=models.CASCADE,
        related_name="items"
    )
    product = models.ForeignKey(
        Products,
        on_delete=models.PROTECT,
        related_name="items"
    )

    quantity = models.PositiveIntegerField()
    selling_price = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.bill.invoice_no} - {self.vendor_product}"
