export interface TransactionFormItems {
    product?: string | number;
    item_name?: string;
    item_type: string;
    quantity?: number;
    price: number;
}


export interface TransactionFormValues {
    transaction_type: string;
    date: string;
    items: TransactionFormItems[];
}