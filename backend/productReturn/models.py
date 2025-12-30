from django.db import models
from product.models import Products, VendorProducts
from vendors.models import Vendors
from bill.models import Bill, BillItem


# Create your models here.
class ProductReturn(models.Model):
    vendor_product = models.ForeignKey(
        VendorProducts, on_delete=models.PROTECT, related_name="product_returns"
    )

    bill = models.ForeignKey(
        Bill,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="product_returns",
    )

    bill_item = models.ForeignKey(
        BillItem,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="product_returns",
    )
    return_qty = models.PositiveIntegerField()
    return_type = models.SmallIntegerField(
        choices=[
            (1, "Sold"),
            (2, "Not Sold"),
        ]
    )

    customer_name = models.CharField(max_length=255, null=True, blank=True)
    return_reference = models.CharField(
        max_length=255, null=True, blank=True, unique=True
    )
    resolution_type = models.SmallIntegerField(
        choices=[
            (1, "Refund"),
            (2, "Replacement"),
        ],
        null=True,
        blank=True,
    )
    status = models.SmallIntegerField(
        choices=[
            (1, "Pending"),
            (2, "Resolved"),
            (3, "Rejected"),
        ],
        default=1,
    )
    reason = models.TextField(null=True, blank=True)
    return_date = models.DateTimeField(auto_now_add=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "product_returns"

    def __str__(self):
        return self.return_reference
