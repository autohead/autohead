from rest_framework import serializers
from .models import Bill, BillItem
from product.models import Products
from django.db import transaction
from decimal import Decimal




class BillItemSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = BillItem
        fields = ["id", "bill", "product", "quantity", "selling_price"]
        read_only_fields = ["id", "created_at", "updated_at", "bill"]


class BillFormSerializer(serializers.ModelSerializer):

    items = BillItemSerializer(many=True, write_only=True)

    class Meta:
        model = Bill
        fields = [
            "id",
            "invoice_no",
            "customer_name",
            "net_amount",
            "discount",
            "total_amount",
            "items",
            "created_at",
            "updated_at",
        ]

        read_only_fields = ["id", "invoice_no", "created_at", "updated_at", "net_amount", "total_amount"]

    def create(self, validated_data):
        items_data = validated_data.pop("items", [])
        discount = validated_data.get("discount", Decimal("0.00"))
        
        

        if not items_data:
            raise serializers.ValidationError(
                {"items": "At least one bill item is required."}
            )

        bill_items = []
        net_amount = Decimal("0.00")

        with transaction.atomic():
            # Loop through items and handle stock safely
            for item in items_data:
                vp = Products.objects.select_for_update().get(id=item["product"].id)

                if item["quantity"] > vp.stock:
                    raise serializers.ValidationError(
                        {
                            "items": f"Insufficient stock for product '{vp.product_name}'. "
                                     f"Available stock: {vp.stock}, requested: {item['quantity']}."
                        }
                    )

                # Subtract stock
                vp.stock -= item["quantity"]
                vp.save()

                # Calculate line total
                line_total = item["quantity"] * item["selling_price"]
                net_amount += line_total

                # Prepare BillItem (without bill yet)
                bill_items.append(BillItem(**item))

            # Calculate total amount
            total_amount = net_amount - discount
            if total_amount < 0:
                raise serializers.ValidationError(
                    {"discount": "Discount Amount Cannot be greater than Net Amount."}
                )

            # Create the Bill
            bill = Bill.objects.create(
                **validated_data,
                net_amount=net_amount,
                total_amount=total_amount
            )

            # Assign bill to items and bulk create
            for item in bill_items:
                item.bill = bill

            BillItem.objects.bulk_create(bill_items)

        return bill
    
    
    
class BillItemReadSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.product_name', read_only=True)
    product_code = serializers.CharField(source='product.product_code', read_only=True)

    class Meta:
        model = BillItem
        fields = ["id", "bill", "product", "product_name", "product_code", "quantity", "selling_price"]
        read_only_fields = ["id", "created_at", "updated_at", "bill"]
        
        
class BillReadSerializer(serializers.ModelSerializer):
    items = BillItemReadSerializer(many=True, read_only=True)

    class Meta:
        model = Bill
        fields = [
            "id",
            "invoice_no",
            "customer_name",
            "net_amount",
            "discount",
            "total_amount",
            "items",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "invoice_no", "created_at", "updated_at"]
