from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers


class LoginTokenSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data =  super().validate(attrs)
        user = self.user
        if user.is_superuser:
            data['is_superuser'] = True
        else:
            data['is_superuser'] = False
        return data