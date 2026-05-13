from django.shortcuts import render
from utils.response import custom_response
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .serializers import TransactionFormSerializers

# Create your views here.


#Create Transaction
class ListCreateTransactionView(generics.ListCreateAPIView):
    # permission_classes = [IsAuthenticated]
    
    
    def get_serializer_class(self):
        if self.request.method == "POST":
            return TransactionFormSerializers
    
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return custom_response(method="POST", data_name="Transaction", data=None)