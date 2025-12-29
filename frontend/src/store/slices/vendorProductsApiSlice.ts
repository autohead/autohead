import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithAuthCheck from "../baseQueryWithAuthCheck";
import { HttpMethod } from "../../constants";
import type{ VendorProductFormValues, VendorProduct, VendorProductUpdateValues } from "../../types/vendorProduct";



export const vendorProductApiSlice = createApi({
    reducerPath: "vendorProductApi",
    baseQuery: baseQueryWithAuthCheck,
    tagTypes: ["vendorProduct"],

    endpoints: (builder) => ({

        // Create VendorProduct
         createVendorProduct: builder.mutation<VendorProduct,VendorProductFormValues >({
            query: (vendorProduct) => ({
                url: "/products/vendor_products/",
                method: HttpMethod.POST,
                body: vendorProduct,
            }),
        }),

        updateVendorProductStock: builder.mutation<void,VendorProductUpdateValues>({
            query: (vendorProductUpdate) => ({
                url: `/products/vendor_products/${vendorProductUpdate.id}/`,
                method: HttpMethod.PATCH,
                body: vendorProductUpdate,
            }),
        }),
    }),
});

export const {
    useCreateVendorProductMutation,
    useUpdateVendorProductStockMutation,
} = vendorProductApiSlice;

