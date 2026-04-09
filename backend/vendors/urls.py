from django.urls import path
from . import views

urlpatterns = [
    path('', views.VendorsListCreateView.as_view(), name='vendor-list-create'),
    path('<int:pk>/', views.VendorsUpdateDestroyView.as_view(), name='vendor-detail')
    path('delete-all/', views.DeleteAllVendorsView.as_view(), name='delete-all-vendors'),
]