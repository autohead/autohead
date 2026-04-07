
import type{ Product, Vendor } from "./product";
// import type {VendorProduct} from "./vendorProduct";

type ProductBasic = Pick<Product, 'id' | 'product_name' | 'product_code' | 'cost' | 'price' | 'stock'>;
// type VendorProductBasic = Pick<VendorProduct, 'id' | 'vendor' | 'stock' | 'product' | 'vendor_detail' | 'price'>;

export interface DropDownListData  {
    products : ProductBasic[];
    vendors : Vendor[];
}

export interface DropDownListApiResponse  {
    success: boolean;
    message: string;
    data: DropDownListData;
}