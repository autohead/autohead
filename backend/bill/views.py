from django.shortcuts import render
from rest_framework import generics
from .models import Bill
from .serializers import BillFormSerializer, BillReadSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from utils.response import custom_response
from django.db.models import Q

# Create your views here.

class BillPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 1000
    
    def get_paginated_response(self, data):
        return custom_response(
            data={
                "count": self.page.paginator.count,
                "next": self.get_next_link(),
                "previous": self.get_previous_link(),
                "billing_data": data,
                "current_page": self.page.number,
                "total_pages": self.page.paginator.num_pages,
            },
            method="GET",
            data_name="Bills"
        )


class BillListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]

    queryset = (
        Bill.objects.all()
        .order_by("-created_at")[:5]
    )

    def get_serializer_class(self):
        if self.request.method == "POST":
            return BillFormSerializer
        return BillFormSerializer

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()

        serializer = self.get_serializer(queryset, many=True)
        return custom_response(data=serializer.data, method="GET", data_name="Bills")

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return custom_response(
            method="POST",
            data_name="Bill",
            data=serializer.data,
        )


from rest_framework.filters import SearchFilter

class BillSearchView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = BillReadSerializer
    pagination_class = BillPagination
    queryset = Bill.objects.all().order_by("-created_at")
    filter_backends = [SearchFilter]
    search_fields = ["invoice_no", "customer_name"]
        
class DownloadInvoiceView(generics.RetrieveAPIView):
    serializer_class = BillReadSerializer
    lookup_field = 'invoice_no'
    queryset = Bill.objects.all()
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return custom_response(
            data=serializer.data,
            method='GET',
            data_name='Bill'
        )