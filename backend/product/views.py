from django.shortcuts import render
import logging
from rest_framework import generics
from rest_framework.pagination import PageNumberPagination
from utils.response import custom_response
from rest_framework.permissions import IsAuthenticated
from .models import VendorProducts, Products
from category.models import Category
from .serializers import (
    ProductSerializer,
    ProductFormSerializer,
    CategoryBriefSerializer,
)


# Create your views here.
class Pagination(PageNumberPagination):
    page_size = 10
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
    pagination_class = Pagination

    def get_serializer_class(self):
        if self.request.method == "POST":
            return ProductFormSerializer
        return ProductSerializer

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
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
            data={"products": serializer.data, "categories": categories}, method="GET", data_name="products"
        )

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return custom_response(data=serializer.data, method="POST", data_name="Product")


class ProductUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
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
