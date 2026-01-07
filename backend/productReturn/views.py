from rest_framework import generics
from .serializers import VendorProductReturnSerializer, CustomerProductReturnSerializer
from rest_framework.permissions import IsAuthenticated
from utils.response import custom_response
from rest_framework.response import Response





class CreateProductReturn(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    
    
    def get_serializer(self, *args, **kwargs):
        return_type = self.request.data.get("return_type")
        
        
        if return_type == "1":
            return VendorProductReturnSerializer(*args, **kwargs)
        return CustomerProductReturnSerializer(*args, **kwargs)
    
    def create(self, request, *args, **kwargs):
        
        if "return_type" not in request.data:
            return Response(
                {
                    "success": False,
                    "return_type": ["This field is required."],
                    "message": "Bad Request"
                },
                status=400
            )

        return_type = request.data.get("return_type")

        if return_type not in ["1", "2"]:
            return Response(
                {
                    "success": False,
                    "return_type": ["Invalid return type"],
                    "message": "Bad Request"
                },
                status=400
            )

            
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        data_name = (
            "VendorProductReturn"
            if request.data.get("return_type") == "1"
            else "CustomerProductReturn"
        )
        return custom_response(data=serializer.data, method="POST", data_name=data_name)
