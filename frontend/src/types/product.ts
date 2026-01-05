export interface Category {
    id: number;
    name: string;
}

export interface Vendor {
    id: number;
    name: string;
}

export interface VendorProduct  {
    id: number;
    vendor_code: string;
    vendor_detail?: Vendor | null;
    price: number,
    cost: number,
    stock: number,
    is_active: boolean,
    product: number,
    vendor: number
}


export interface Product  {
    id: number;
    product_code: string;
    stock_count: number;
    category_detail?: Category | null;
    vendor_products?: VendorProduct [] | null;
    product_name: string;
    description?: string;
    is_active: boolean;
    image?: string
    image_url?: string
}

export interface Paginated {
    count: number;
    current_page: number;
    next: string | null;
    previous: string | null;
    total_pages: number;
    results: Product [];
}

export interface ProductListData  {
    products: Paginated;
    categories: Category[]
    // vendors: Vendor[]
}

export interface ProductListApiResponse  {
    success: boolean;
    message: string;
    data: ProductListData;
}


export interface ProductAnalysisApiResponse  {
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

export interface ProductFormValues  {
    product_name: string;
    product_code: string;
    category: number | string;
    description?: string;
    image?: File | null;
}


export interface ProductUpdateValues  extends ProductFormValues  {
    id: number;
}