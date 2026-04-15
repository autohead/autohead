import { baseApi } from "./baseApiSlice";
import { HttpMethod } from "../../constants";
import type { BillingAllApiResponse, BillingAllPaginatedData } from "../../types/billing";

type BillingQueryParams = {
  page?: number;
  search?: string;
  page_size?: number;
  ordering?: string; 
};

export const billingAllApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllBills: builder.query<BillingAllPaginatedData, BillingQueryParams>({
      query: ({ page = 1, search, page_size = 10, ordering }) => {
        const params = new URLSearchParams();

        params.append("page", String(page));
        params.append("page_size", String(page_size));

        if (search) params.append("search", search);
        if (ordering) params.append("ordering", ordering);

        return {
          url: `/billing/bill-all/?${params.toString()}`,
          method: HttpMethod.GET,
        };
      },

      transformResponse: (response: BillingAllApiResponse) => response.data,

      providesTags: ["BillingAll"],
    }),
  }),
});


export const {
    useGetAllBillsQuery,
} = billingAllApiSlice;
