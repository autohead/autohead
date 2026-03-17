
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