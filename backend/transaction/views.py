from django.shortcuts import render
from utils.response import custom_response
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .serializers import TransactionFormSerializers, TransactionReadSerializer
from .models import Transaction
from datetime import datetime

# Create your views here.


# Create Transaction
class ListCreateTransactionView(generics.ListCreateAPIView):
    # permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == "POST":
            return TransactionFormSerializers
        return TransactionReadSerializer

    def get_queryset(self):
        queryset = Transaction.objects.all()

        from_date = self.request.GET.get("from_date")
        to_date = self.request.GET.get("to_date")

        if from_date and to_date:

            from_date = datetime.strptime(from_date, "%Y-%m-%d").date()

            to_date = datetime.strptime(to_date, "%Y-%m-%d").date()

            queryset = queryset.filter(date__range=[from_date, to_date])
            
        return queryset.order_by("-date")

    
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()

        serializer = self.get_serializer(queryset, many=True)
        return custom_response(data=serializer.data, method="GET", data_name="Transactions")

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return custom_response(method="POST", data_name="Transaction", data=None)
