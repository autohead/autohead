import { useCreateBillMutation, useGetBillsQuery } from "../store/slices/billingApiSlice";
import { useGetAllBillsQuery } from "../store/slices/billingAllApiSlice";
import { useDownloadInvoiceQuery } from "../store/slices/downloadInvoiceSlice";


export const useBillingData = () => {

    const { data, isLoading, isError } = useGetBillsQuery();
    const [createBill, { isLoading: isCreating }] = useCreateBillMutation();

    return {
        data, isLoading, isError,
        isCreating, createBill
    };
}



type BillingParams = {
  page: number;
  search: string;
  page_size?: number;
};

export const useBillingAllData = ({ page, search, page_size }: BillingParams) => {
  const { data, isLoading, isError } = useGetAllBillsQuery({
    page,
    search,
    page_size,
  });

  return { data, isLoading, isError };
};

export const useDownloadInvoice = (invoiceId: string) => {

    const { data, isLoading, isError } = useDownloadInvoiceQuery(invoiceId);

    return {
        data, isLoading, isError
    };
}