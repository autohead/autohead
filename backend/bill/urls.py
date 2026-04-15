from django.urls import path
from . import views

urlpatterns = [
    path('', views.BillListCreateView.as_view(), name='bill-list-create'),
    path('bill-all/', views.BillSearchView.as_view(), name='bill-search'),
    path('download-invoice/<str:invoice_no>/', views.DownloadInvoiceView.as_view(), name='download-invoice')
]