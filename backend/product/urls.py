from django.urls import path
from . import views


urlpatterns = [
    path('', views.ProductListCreateView.as_view(), name='product-list-create'),
    path('<int:pk>/', views.ProductUpdateDestroyView.as_view(), name='product-detail'),
    path('get_dropdown_data/', views.DropdownDataList.as_view(), name='get-product-dropdown-data'),
    path('vendor_products/', views.VendorProductListCreateView.as_view(), name='vendor-product-list-create'),
    path('vendor_products/<int:pk>/', views.VendorProductUpdateDestroyView.as_view(), name='vendor-product-detail'),
]


