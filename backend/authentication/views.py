from django.shortcuts import render
from rest_framework_simplejwt.views import TokenObtainPairView
from authentication.serializers import LoginTokenSerializer

# Create your views here.

class LoginTokenObtainPairView(TokenObtainPairView):
    serializer_class = LoginTokenSerializer
