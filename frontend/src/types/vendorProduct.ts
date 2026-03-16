
import type{ Vendor, Product } from "./product";

type ProductBasic = Pick<Product, 'id' | 'product_name'>;


export interface VendorProduct  {
    id: number;
    vendor_detail?: Vendor | null;
    product_detail?: ProductBasic | null;
    stock_supplied?: number | null;
    cost?: number,
    is_active: boolean,
    product: number,
    vendor: number
}


export interface VendorProductFormValues  {
    vendor_code: string;
    price: number | string,
    cost: number | string,
    stock: number | string,
    product: number | string,
    vendor: number | string
}


type VendorProductStockFormValues = Pick<VendorProduct,  'stock_supplied'>;

export interface VendorProductUpdateValues extends VendorProductStockFormValues {
    id: number
}



