from rest_framework import serializers
from .models import Transaction, TransactionItem
from django.db import transaction
from product.models import Products
from decimal import Decimal


class TransactionItemSerializer(serializers.ModelSerializer):

    # When user sends product ID, automatically fetch Product object from DB.
    product = serializers.PrimaryKeyRelatedField(
        queryset=Products.objects.all(),
        required=False,
        allow_null=True,
    )

    item_name = serializers.CharField(required=False, allow_blank=True)

    quantity = serializers.IntegerField(min_value=1)

    price = serializers.DecimalField(max_digits=10, decimal_places=2, min_value=0.01)

    class Meta:
        model = TransactionItem
        fields = [
            "id",
            "item_type",
            "product",
            "item_name",
            "quantity",
            "price",
        ]

    # validate item
    def validate(self, attrs):
        item_type = attrs.get("item_type")

        if item_type in ["SERVICE", "OTHER"]:
            if not attrs.get("item_name"):
                raise serializers.ValidationError(
                    {"item_name": "This field is required."}
                )

        return attrs


class TransactionFormSerializers(serializers.ModelSerializer):
    items = TransactionItemSerializer(
        many=True,
        allow_empty=False,
        error_messages={"empty": "At least one transaction item is required."},
    )

    class Meta:
        model = Transaction
        fields = [
            "id",
            "transaction_type",
            "date",
            "total_amount",
            "created_at",
            "items",
        ]
        read_only_fields = ["id", "created_at", "total_amount"]

    def validate(self, attrs):
        transaction_type = attrs.get("transaction_type")
        items = attrs.get("items", [])

        # Validate that EXPENSE transactions do not have PRODUCT items
        for index, item in enumerate(items):
            item_type = item.get("item_type")

            # EXPENSE should not accept PRODUCT rows
            if transaction_type == "EXPENSE" and item_type == "PRODUCT":
                raise serializers.ValidationError(
                    {
                        "items": {
                            index: {
                                "item_type": (
                                    "PRODUCT is not allowed for EXPENSE. " "Use OTHER."
                                )
                            }
                        }
                    }
                )

            # INCOME product sale must specify product
            if transaction_type == "INCOME" and item_type == "PRODUCT":
                if not item.get("product"):
                    raise serializers.ValidationError(
                        {"items": {index: {"product": "Product is required."}}}
                    )

        return attrs

    @transaction.atomic
    def create(self, validated_data):
        item_data = validated_data.pop("items")
        total_amount = Decimal("0.00")

        # create transaction
        transaction_obj = Transaction.objects.create(total_amount=0, **validated_data)

        # create child Items
        for item in item_data:
            qty = item["quantity"]
            price = item["price"]

            total_amount += Decimal(qty) * Decimal(price)

            #  Reduce stock only for product
            if item["item_type"] == "PRODUCT":
                product = item["product"]

                if product.stock < qty:
                    raise serializers.ValidationError(
                        {"stock": f"{product.product_name} insufficient stock"}
                    )

                product.stock -= qty
                product.save()

            TransactionItem.objects.create(transaction=transaction_obj, **item)

        transaction_obj.total_amount = total_amount
        transaction_obj.save()
        return transaction_obj



class TransactionItemReadSerializer(serializers.ModelSerializer):

    product_name = serializers.CharField(
        source="product.product_name",
        read_only=True
    )

    class Meta:
        model = TransactionItem
        fields = [
            "id",
            "item_type",
            "product",
            "product_name",
            "item_name",
            "quantity",
            "price",
        ]

class TransactionReadSerializer(serializers.ModelSerializer):
    items = TransactionItemReadSerializer(many=True, read_only=True)

    class Meta:
        model = Transaction
        fields = [
            "id",
            "transaction_type",
            "total_amount",
            "created_at",
            "items",
        ]
        read_only_fields = ["id", "created_at", "total_amount"]