from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from utils.response import custom_response
from product.models import Products, VendorProducts
from vendors.models import Vendors
from bill.models import Bill
from django.utils import timezone
from django.db.models import Sum, Count
from django.db import models
import calendar
from django.db.models.functions import ExtractMonth

# Create your views here.


today = timezone.now().date()
current_month = timezone.now().month
current_year = timezone.now().year


class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        total_products = Products.objects.filter(is_active=True).count()
        low_stock = VendorProducts.objects.filter(is_active=True, stock__lt=5).count()
        total_vendors = Vendors.objects.filter(is_active=True).count()

        bill_query = Bill.objects.all()

        bill_query_data = bill_query.aggregate(
            todays_sales_today=Sum(
                "total_amount", filter=models.Q(created_at__date=today)
            ),
            total_bills=Count("id"),
            monthly_revenue=Sum(
                "total_amount",
                filter=models.Q(
                    created_at__year=current_year, created_at__month=current_month
                ),
            ),
        )

        low_stock_products = (
            VendorProducts.objects.filter(
                is_active=True, stock__lt=5, product__isnull=False
            )
            .select_related("vendor", "product")
            .values(
                "vendor__id",
                "vendor__name",
                "product__id",
                "product__product_name",
                "stock",
            )
        )

        monthly_sales = (
            Bill.objects.filter(created_at__year=current_year)
            .annotate(month=ExtractMonth("created_at"))
            .values("month")
            .annotate(total_sales=Sum("total_amount"))
            .order_by("month")
        )
        
        sales_by_month = {
            row["month"]: row["total_sales"] or 0
            for row in monthly_sales
        }

        result = []

        for month in range(1, 13):
            result.append({
                "month": calendar.month_name[month],  # Full month name
                "total_sales": sales_by_month.get(month, 0)
            })

        dashBoardData = {
            "total_products": total_products,
            "low_stock": low_stock,
            "total_vendors": total_vendors,
            "total_sales_today": bill_query_data["todays_sales_today"] or 0,
            "total_bills": bill_query_data["total_bills"],
            "monthly_revenue": bill_query_data["monthly_revenue"] or 0,
            "low_stock_products": low_stock_products,
            "monthly_sales": result,
        }

        return custom_response(
            data=dashBoardData,
            method="GET",
            data_name="Dashboard data",
        )
