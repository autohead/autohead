import type { VendorProduct } from "./vendorProduct";

export interface BankResponse {
    id?: number;
    account_number?: string;
    ifsc_code?: string;
    is_active: boolean;
    bank_name?: string;
    branch_name?: string;
}

export interface BankInput {
    bank_name?: string;
    branch_name?: string;
    account_number?: string;
    ifsc_code?: string;
}


export interface VendorResponse {
    id: number;
    bank?: BankResponse | null;
    vendor_products?: VendorProduct[] | null;
    name: string;
    phone: number;
    email: string;
    address?: string;
    is_active: boolean;
    gst_number?: string;
    state?: string;
    city?: string;
    pincode?: string;
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
    email: string;
    address?: string;
    gst_number?: string;
    state?: string;
    city?: string;
    pincode?: string;
    bank?: BankInput;
}


export interface VendorUpdateData extends VendorFormData {
    id: number;
}