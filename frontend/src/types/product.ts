export interface Category {
    id: number;
    name: string;
}

export interface Vendor {
    id: number;
    name: string;
}

export interface VendorProduct {
    id: number;
    vendor_detail?: Vendor | null;
    cost: number,
    stock_supplied: number,
    is_active: boolean,
    product: number,
    vendor: number
}


export interface Product {
    id: number;
    stock_supplied: number;
    vendor_products?: VendorProduct[] | null;
    product_name: string;
    product_code: string;
    is_active: boolean;
    cost: number;
    price: number;
    stock: number;
}

export interface Paginated {
    count: number;
    current_page: number;
    next: string | null;
    previous: string | null;
    total_pages: number;
    results: Product[];
}

export interface ProductListData {
    products: Paginated;
}

export interface ProductListApiResponse {
    success: boolean;
    message: string;
    data: ProductListData;
}


export interface ProductAnalysisApiResponse {
    success: boolean;
    message: string;
    data: {
        productId: number;
        total_sales: number;
        total_revenue: string;
        this_month_sales: number;
        last_2day_sales: number;
    };
}



export interface ProductItem {
  product_name: string;
  product_code: string;
  stock: string;
  cost: string;
  price: string;
}

export interface VendorData {
  name?: string;
  phone?: string;
}

export interface ProductFormValues {
    product_data:ProductItem[];
    vendor_data?: VendorData;
}

export interface ProductUpdateValues extends ProductFormValues {
    id: number;
}