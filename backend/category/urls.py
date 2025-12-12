from django.urls import path
from . import views


urlpatterns = [
    path('', views.CategoryListCreateView.as_view(), name='category-list-create'),
    path('<int:pk>/', views.CategoryRetrieveUpdateDestroyView.as_view(), name='category-detail')
]