import { HttpMethod } from "../../constants";
import type { BillFormValues, BillingApiResponse, BillListData } from "../../types/billing";
import { baseApi } from "./baseApiSlice";

export const billingApiSlice = baseApi.injectEndpoints({
    
    endpoints: (builder) => ({

        getBills: builder.query<BillListData[], void>({
            query: () => ({
                url: "/billing/",
                method: HttpMethod.GET,
            }),
            transformResponse: (response: BillingApiResponse) => response.data,
            providesTags: ["Billing"],
        }),
        // create Bill
        createBill: builder.mutation<void, BillFormValues>({
            query: (bill) => ({
                url: "/billing/",
                method: HttpMethod.POST,
                body: bill,
            }),
            invalidatesTags : ["Billing", "DropDown", "Dashboard"],
        }), 

    })
});

export const {
    useCreateBillMutation,
    useGetBillsQuery
} = billingApiSlice