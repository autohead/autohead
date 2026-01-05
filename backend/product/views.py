from django.shortcuts import render
import logging
from rest_framework import generics
from rest_framework.pagination import PageNumberPagination
from utils.response import custom_response
from rest_framework.permissions import IsAuthenticated
from .models import VendorProducts, Products
from category.models import Category
from .serializers import (
    ProductSalesAnalysisSerializer,
    ProductSerializer,
    ProductFormSerializer,
    CategoryBriefSerializer,
    VendorBriefSerializer,
    ProductBriefSerializer,
    VendorProductBriefSerializer,
    VendorProductFormSerializer,
    VendorProductRead,
)
from rest_framework.parsers import MultiPartParser, FormParser
from django.db.models import Sum
from django.db import models
from django.db.models.functions import Coalesce
from vendors.models import Vendors
from bill.models import Bill, BillItem


# Create your views here.
class ProductPagination(PageNumberPagination):
    page_size = 6
    page_size_query_param = "page_size"
    max_page_size = 100


class ProductListCreateView(generics.ListCreateAPIView):
    queryset = (
        Products.objects.filter(is_active=True)
        .select_related("category")
        .prefetch_related(
            "vendor_products",
        )
        .order_by("-created_at")
    )
    permission_classes = [IsAuthenticated]
    pagination_class = ProductPagination
    parser_classes = (MultiPartParser, FormParser)

    def get_serializer_class(self):
        if self.request.method == "POST":
            return ProductFormSerializer
        return ProductSerializer

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset().annotate(
            stock_count=Coalesce(
                Sum(
                    "vendor_products__stock",
                    filter=models.Q(vendor_products__is_active=True),
                ),
                0,
            )
        )

        page = self.paginate_queryset(queryset)

        categories = CategoryBriefSerializer(
            Category.objects.filter(is_active=True), many=True
        ).data

        if page is not None:
            serializer = self.get_serializer(page, many=True)

            return custom_response(
                data={
                    "products": {
                        "count": self.paginator.page.paginator.count,
                        "next": self.paginator.get_next_link(),
                        "previous": self.paginator.get_previous_link(),
                        "results": serializer.data,
                        "current_page": self.paginator.page.number,
                        "total_pages": self.paginator.page.paginator.num_pages,
                    },
                    "categories": categories,
                },
                method="GET",
                data_name="products",
            )

        # no pagination fallback
        serializer = self.get_serializer(queryset, many=True)
        return custom_response(
            data={"products": serializer.data, "categories": categories},
            method="GET",
            data_name="products",
        )

    def create(self, request, *args, **kwargs):
        print("RAW DATA:", request.data)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return custom_response(data=serializer.data, method="POST", data_name="Product")


class ProductUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)
    queryset = (
        Products.objects.filter(is_active=True)
        .select_related("category")
        .prefetch_related("vendor_products")
        .order_by("-created_at")
    )
    serializer_class = ProductFormSerializer

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", True)  # allow partial update
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return custom_response(data=serializer.data, method="PUT", data_name="Product")

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.is_active = not instance.is_active
        instance.save(update_fields=["is_active"])
        method = "DEACTIVATE" if instance.is_active else "REACTIVATE"
        return custom_response(data=None, method=method, data_name="Product")


# View for listing products and vendors for dropdowns.
class DropdownDataList(generics.ListAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):

        products = ProductBriefSerializer(
            Products.objects.filter(is_active=True), many=True
        ).data

        vendor_data = VendorBriefSerializer(
            Vendors.objects.filter(is_active=True), many=True
        ).data

        vendor_products = VendorProductBriefSerializer(
            VendorProducts.objects.filter(is_active=True), many=True
        ).data

        return custom_response(
            data={
                "products": products,
                "vendors": vendor_data,
                "vendor_products": vendor_products,
            },
            method="GET",
            data_name="dropdown_data",
        )


# View for listing and creating VendorProducts.
class VendorProductListCreateView(generics.ListCreateAPIView):
    queryset = (
        VendorProducts.objects.filter(is_active=True)
        .select_related("product", "vendor")
        .order_by("-created_at")
    )
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == "POST":
            return VendorProductFormSerializer
        return VendorProductRead

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return custom_response(
            data={"vendor_products": serializer.data},
            method="GET",
            data_name="VendorProducts",
        )

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return custom_response(
            data=serializer.data, method="POST", data_name="VendorProduct"
        )


class VendorProductUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = VendorProducts.objects.filter(is_active=True).select_related(
        "product", "vendor"
    )
    serializer_class = VendorProductFormSerializer

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", True)  # allow partial update
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return custom_response(
            data=serializer.data, method="PUT", data_name="VendorProduct"
        )

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.is_active = not instance.is_active
        instance.save(update_fields=["is_active"])
        method = "DEACTIVATE" if instance.is_active else "REACTIVATE"
        return custom_response(data=None, method=method, data_name="VendorProduct")


# View for product sales analysis
from rest_framework.views import APIView
from django.utils import timezone
from datetime import timedelta
from django.db.models import F, DecimalField, ExpressionWrapper, Q


class ProductSalesAnalysisView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):

        now = timezone.now()
        start_of_month = now.replace(day=1, hour=0, minute=0, second=0)
        last_2_days = now - timedelta(days=2)

        # for each bill item calculate qty and selling_price
        revenue_expr = ExpressionWrapper(
            F("quantity") * F("selling_price"),
            output_field=DecimalField(max_digits=12, decimal_places=2),
        )

        query = BillItem.objects.filter(vendor_product__product_id=pk)

        analytics = query.aggregate(
            total_sales=Sum("quantity"),
            total_revenue=Sum(revenue_expr),
            this_month_sales=Sum(
                "quantity", filter=Q(bill__created_at__gte=start_of_month)
            ),
            last_2day_sales=Sum(
                "quantity", filter=Q(bill__created_at__gte=last_2_days)
            ),
        )

        analysis_data = {
            "productId": pk,
            "total_sales": analytics["total_sales"] or 0,
            "total_revenue": analytics["total_revenue"] or 0.00,
            "this_month_sales": analytics["this_month_sales"] or 0,
            "last_2day_sales": analytics["last_2day_sales"] or 0,
        }

        serializer = ProductSalesAnalysisSerializer(analysis_data)

        return custom_response(
            data=serializer.data,
            method="GET",
            data_name="ProductSalesAnalysis",
        )
