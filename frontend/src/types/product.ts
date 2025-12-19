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
    category_detail?: Category | null;
    vendor_products?: VendorProduct [] | null;
    product_name: string;
    description?: string;
    is_active: boolean;
    image?: string
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
}

export interface ProductListApiResponse  {
    success: boolean;
    message: string;
    data: ProductListData;
}


export interface ProductFormValues  {
    product_name: string;
    category: number;
    vendor: number;
    vendor_code: string;
    price: string;
    cost: string;
    stock: string;
    description?: string;
    image?: string;
}


export interface ProductUpdateValues  extends ProductFormValues  {
    id: number;
}   