import { baseApi } from "./baseApiSlice";
import { HttpMethod } from "../../constants";
import type { TransactionFormValues } from "../../types/transactions";


export const transactionApliSlice = baseApi.injectEndpoints({

    endpoints: (builder) => ({
        // Create transaction
        createTransactions: builder.mutation<void, TransactionFormValues>({

            query: (data) => ({
                url: "/transactions/",
                method: HttpMethod.POST,
                body: data,
            }),
            invalidatesTags: ["Product"],
        }),
    }),
});


export const {
    useCreateTransactionsMutation,
} = transactionApliSlice;
