
import type{ Product, Vendor } from "./product";
import type {VendorProduct} from "./vendorProduct";

type ProductBasic = Pick<Product, 'id' | 'product_name'>;
type VendorProductBasic = Pick<VendorProduct, 'id' | 'vendor' | 'stock' | 'product' | 'vendor_detail'>;

export interface DropDownListData  {
    products : ProductBasic[];
    vendors : Vendor[];
    vendor_products: VendorProductBasic[];
}

export interface DropDownListApiResponse  {
    success: boolean;
    message: string;
    data: DropDownListData;
}