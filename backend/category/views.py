from django.shortcuts import render
import logging
from rest_framework import generics
from rest_framework.pagination import PageNumberPagination
from utils.response import custom_response
from .serializers import CategorySerializer
from .models import Category
from rest_framework.permissions import IsAuthenticated
# Create your views here.

logger = logging.getLogger(__name__)


class CategoryPagination(PageNumberPagination):
    page_size = 1  # show only 10 per page
    page_size_query_param = 'page_size'  # optional: allow ?page_size=XX
    max_page_size = 100 

class CategoryListCreateView(generics.ListCreateAPIView):
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]
    # pagination_class = CategoryPagination

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
            }

            return custom_response(
                data=paginated_data,
                method='GET',
                data_name='categories'
            )

        # no pagination fallback
        serializer = self.get_serializer(queryset, many=True)
        return custom_response(
            data=serializer.data,
            method='GET',
            data_name='categories'
        )

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return custom_response(data=serializer.data, method='POST', data_name='Category')

    def perform_create(self, serializer):
        serializer.save(is_active=True)
        
        
class CategoryRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return custom_response(data=serializer.data, method='GET', data_name='Category')

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', True)  # allow partial update
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return custom_response(data=serializer.data, method='PUT', data_name='Category')

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return custom_response(data=None, method='DELETE', data_name='Category')

    
