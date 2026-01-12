

export interface MonthlySalesData {
    month: string;
    total_sales: number
}

export interface LowStockProducts {
    vendor__id: number;
    vendor__name: string;
    product__id: number;
    product__product_name: string;
    stock: number
}


export interface DashboardData {
    total_products: number;
    low_stock: number;
    total_vendors: number;
    total_sales_today: number;
    total_bills: number;
    monthly_revenue: number;
    low_stock_products: LowStockProducts[]
    monthly_sales: MonthlySalesData[]
}

export interface DashboardApiResponse {
    success: boolean;
    message: string;
    data: DashboardData;
}