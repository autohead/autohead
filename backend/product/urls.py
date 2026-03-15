from django.urls import path
from . import views


urlpatterns = [
    path('', views.ProductListCreateView.as_view(), name='product-list-create'),
    path('<int:pk>/', views.ProductUpdateDestroyView.as_view(), name='product-detail'),
    path('get_dropdown_data/', views.DropdownDataList.as_view(), name='get-product-dropdown-data'),
    path('<int:pk>/sales-analysis/', views.ProductSalesAnalysisView.as_view(), name='product-sales-analysis'),
]


