from rest_framework import serializers
from .models import ProductReturn, CustomerProductReturn
from django.db import transaction
from bill.models import Bill, BillItem
from django.shortcuts import get_object_or_404


# Reusable Mixin
class StockValidationMixin:
    def validate_stock(self, vendor_product, return_qty):
        if vendor_product.stock is None or return_qty > vendor_product.stock:
            raise serializers.ValidationError(
                {"return_qty": "Return quantity cannot be greater than stock count."}
            )


class VendorProductReturnSerializer(StockValidationMixin, serializers.ModelSerializer):

    return_type = serializers.ChoiceField(
        choices=[
            ("1", "Vendor"),
            ("2", "Customer"),
        ],
        write_only=True,
    )

    class Meta:
        model = ProductReturn
        fields = ["id", "vendor_product", "return_qty", "reason", "return_type"]
        read_only_fields = ["id"]

    def validate(self, attrs):
        self.validate_stock(attrs["vendor_product"], attrs["return_qty"])
        return attrs

    def create(self, validated_data):
        # remove non-model field
        validated_data.pop("return_type", None)

        with transaction.atomic():

            return_qty = validated_data["return_qty"]
            vendor_product = validated_data["vendor_product"]

            # subtract stock
            vendor_product.stock -= return_qty
            vendor_product.save()

            # try to find existing active return
            existing_return = ProductReturn.objects.filter(
                vendor_product=vendor_product,
                status=1,
            ).first()

            if existing_return:
                # update instead of creating
                existing_return.return_qty += return_qty
                existing_return.save()
                return existing_return

            product_return = ProductReturn.objects.create(**validated_data)
            return product_return


class CustomerProductReturnSerializer(
    StockValidationMixin, serializers.ModelSerializer
):

    return_type = serializers.ChoiceField(
        choices=[
            ("1", "Vendor"),
            ("2", "Customer"),
        ],
        write_only=True,
    )

    class Meta:
        model = CustomerProductReturn
        fields = [
            "id",
            "customer_name",
            "return_qty",
            "reason",
            "resolution_type",
            "vendor_product",
            "return_type",
        ]

    def validate(self, attrs):
        invoice_num = attrs["invoice_num"]
        vendor_product = attrs["vendor_product"]

        try:
            bill = Bill.objects.get(invoice_no=invoice_num)
        except Bill.DoesNotExist:
            raise serializers.ValidationError(
                {"invoice_num": "Invalid invoice number."}
            )

        if not BillItem.objects.filter(
            bill=bill, vendor_product=vendor_product
        ).exists():
            raise serializers.ValidationError(
                {"vendor_product": "This product is not part of the given invoice."}
            )

        self.validate_stock(vendor_product, attrs["return_qty"])

        # stash objects for create()
        attrs["_bill"] = bill

        return attrs

    def create(self, validated_data):
        # remove non-model field
        validated_data.pop("return_type", None)

        with transaction.atomic():
            vendor_product = validated_data["vendor_product"]
            return_qty = validated_data["return_qty"]

            # reduce stock
            vendor_product.stock -= return_qty
            vendor_product.save()

            # try to merge into existing active return
            existing_return = ProductReturn.objects.filter(
                vendor_product=vendor_product,
                status=1,
            ).first()

            if existing_return:
                existing_return.return_qty += return_qty
                existing_return.save()
                return existing_return
            
            # create new ProductReturn
            product_return = ProductReturn.objects.create(
                vendor_product=vendor_product,
                return_qty=return_qty,
                reason=validated_data.get("reason"),
            )

            bill = validated_data.pop("_bill")
            # customer-return–specific logic
            bill_item = BillItem.objects.get(
                bill=bill,
                vendor_product=vendor_product,
            )

            return CustomerProductReturn.objects.create(
                **validated_data,
                product_return=product_return,
                bill=bill,
                bill_item=bill_item,
            )
