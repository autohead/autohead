import { baseApi } from "./baseApiSlice";
import { HttpMethod } from "../../constants";
import type{ VendorProductFormValues, VendorProduct, VendorProductUpdateValues } from "../../types/vendorProduct";



export const vendorProductApiSlice = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        // Create VendorProduct
         createVendorProduct: builder.mutation<VendorProduct,VendorProductFormValues >({
            query: (vendorProduct) => ({
                url: "/products/vendor_products/",
                method: HttpMethod.POST,
                body: vendorProduct,
            }),

            invalidatesTags: ["Vendor"],
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

