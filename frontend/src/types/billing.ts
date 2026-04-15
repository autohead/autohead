
export interface BillFormItem {
    product: number;
    quantity: number;
    selling_price: number;
}

export interface BillFormValues {
    customer_name?: string;
    items: BillFormItem[];
    discount?: number;
}


export interface BillListData {
    id: number;    
    invoice_no: string;
    customer_name?: string;
    net_amount: number;
    discount: number;
    total_amount: number;
    created_at: string;
}


export interface BillingApiResponse {
    success: boolean;
    message: string;
    data: BillListData[];
}



export interface BillingAllApiResponse {
    success: boolean;
    message: string;
    data: BillingAllPaginatedData;
}

export interface BillingAllPaginatedData {
    count: number;
    next: string | null;
    previous: string | null;
    current_page: number;
    total_pages: number;
    billing_data: BillAllListData[];
}

export interface BillAllListData {
    id: number | string,
    invoice_no: string,
    customer_name: string,
    net_amount: number,
    discount: number,
    total_amount: number,
    created_at: string
    items: BillAllListItems[]
}


export interface BillAllListItems {
    id: number | string,
    bill: number | string,
    product: number | string,
    product_name: string,
    product_code: string,
    quantity: number,
    selling_price: number
}