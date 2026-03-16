import type { VendorProduct } from "./vendorProduct";

export interface VendorResponse {
    id: number;
    vendor_products?: VendorProduct[] | null;
    name: string;
    phone: number;
    is_active: boolean;
}

export interface VendorPaginatedResponse {
  count: number;
  current_page: number;
  next: string | null;
  previous: string | null;
  total_pages: number;
  results: VendorResponse[];
}


export interface VendorListResponse {
    success: boolean;
    message: string;
    data: VendorPaginatedResponse;
}

export interface VendorFormData {
    name: string;
    phone: string | number;
}


export interface VendorUpdateData extends VendorFormData {
    id: number;
}