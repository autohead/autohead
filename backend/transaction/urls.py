from django.urls import path
from . import views


urlpatterns = [
    path('', views.ListCreateTransactionView.as_view(), name='transaction-list-create'),
]