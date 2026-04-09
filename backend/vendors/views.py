from django.shortcuts import render
import logging
from rest_framework import generics
from rest_framework.pagination import PageNumberPagination
from utils.response import custom_response
from .serializers import VendorSerializer
from .models import Vendors
from rest_framework.permissions import IsAuthenticated

# Create your views here.

logger = logging.getLogger(__name__)

class VendorsPagination(PageNumberPagination):
    page_size = 6
    page_size_query_param = 'page_size'
    max_page_size = 1000
    

class VendorsListCreateView(generics.ListCreateAPIView):
    queryset = Vendors.objects.filter(is_active=True).order_by('-created_at').all()
    serializer_class = VendorSerializer
    pagination_class = VendorsPagination
    permission_classes = [IsAuthenticated]
    
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        page = self.paginate_queryset(queryset)
        
        if page is not None:
            serializer = self.get_serializer(page, many=True)

            paginated_data = {
                "count": self.paginator.page.paginator.count,
                "next": self.paginator.get_next_link(),
                "previous": self.paginator.get_previous_link(),
                "results": serializer.data,
                "current_page": self.paginator.page.number,
                "total_pages": self.paginator.page.paginator.num_pages
            }

            return custom_response(
                data=paginated_data,
                method='GET',
                data_name='vendors'
            )
            
        # no pagination fallback
        serializer = self.get_serializer(queryset, many=True)
        return custom_response(
            data=serializer.data,
            method='GET',
            data_name='vendors'
        )

    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return custom_response(data=serializer.data, method='POST', data_name='Vendor')
        

class VendorsUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Vendors.objects.all()
    serializer_class = VendorSerializer
    permission_classes = [IsAuthenticated]
    
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)  # don't allow partial update
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return custom_response(data=serializer.data, method='PUT', data_name='Vendor')
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.is_active = not instance.is_active
        instance.save(update_fields=['is_active'])
        method = 'DEACTIVATE' if instance.is_active else 'REACTIVATE'
        return custom_response(data=None, method=method, data_name='Vendor')
    
class DeleteAllVendorsView(generics.GenericAPIView):
    # permission_classes = [IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        Vendors.objects.all().delete()
        return custom_response(data=None, method="DELETE", data_name="Vendors")
