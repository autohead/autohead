import { HttpMethod } from "../../constants";
import { baseApi } from "./baseApiSlice";
import type { BillAllListData } from "../../types/billing";



interface DownloadInvoiceResponse {
    success: boolean;
    message: string;
    data: BillAllListData;
}

export const downloadInvoiceApiSlice = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        downloadInvoice: builder.query<DownloadInvoiceResponse, string>({
            query: (invoiceId) => ({
                url: `/billing/download-invoice/${invoiceId}/`,
                method: HttpMethod.GET,
            }),
            transformResponse: (response: DownloadInvoiceResponse) => response,
        }),
    }),
});

export const {
    useDownloadInvoiceQuery,
} = downloadInvoiceApiSlice;