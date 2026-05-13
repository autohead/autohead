from django.db import models
from product.models import Products
from bill.models import Bill

# Create your models here.

class Transaction(models.Model):
    Transaction_TYPE = [
        ('INCOME', 'Income'),
        ('EXPENSE', 'Expense'),
    ]
    
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    transaction_type = models.CharField(max_length=10, choices=Transaction_TYPE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'transaction'
    
    
class TransactionItem(models.Model):
    ITEM_TYPE = [
        ('PRODUCT', 'Product'),
        ('SERVICE', 'Service'),
        ('BILL', 'Bill'),
        ('OTHER', 'Other'),
    ]
    
    transaction = models.ForeignKey(Transaction, related_name='items', on_delete=models.CASCADE)
    item_type = models.CharField(max_length=10, choices=ITEM_TYPE)
    item_name = models.CharField(max_length=255, null=True, blank=True)  # Optional field for service name
    product = models.ForeignKey(Products, on_delete=models.SET_NULL, null=True, blank=True)  # Optional field to link to a product
    bill = models.ForeignKey(Bill, on_delete=models.SET_NULL, null=True, blank=True)  # Optional field to link to a bill
    quantity = models.PositiveIntegerField(null=True, blank=True)  # Optional field for quantity (relevant for products and services)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    
    class Meta:
        db_table = 'transaction_item'
    
    
#     {
#   "transaction_type": "INCOME",
#   "amount": 1500,
#   "description": "Mixed sale",
#   "items": [
#     {
#       "item_type": "SERVICE",
#       "service_id": 1,
#       "quantity": 1,
#       "price": 500
#     },
#     {
#       "item_type": "PRODUCT",
#       "product_id": 3,
#       "quantity": 2,
#       "price": 500
#     }
#   ]
# }