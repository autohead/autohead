import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithAuthCheck from "../baseQueryWithAuthCheck";
import { HttpMethod } from "../../constants";
import type { ProductListApiResponse, ProductListData, Product, ProductFormValues, ProductUpdateValues  } from "../../types/product";

export const productApiSlice = createApi({
    reducerPath: "productApi",
    baseQuery: baseQueryWithAuthCheck,
    tagTypes: ["Product"],
    endpoints: (builder) => ({
        // Get all products
        getProducts: builder.query<ProductListData, { page?: number }>({
            query: ({ page = 1 }) => ({
                url: `/products/?page=${page}`,
                method: HttpMethod.GET,
            }),
            transformResponse: (response: ProductListApiResponse) => response.data,
            providesTags: ["Product"],
        }),

        // create Product
        createProduct: builder.mutation<Product, ProductFormValues>({
            query: (product) => ({
                url: "/products/",
                method: HttpMethod.POST,
                body: product,
            }),
            invalidatesTags: ["Product"],
        }),

        // update Product
        updateProduct: builder.mutation<Product, ProductUpdateValues>({
            query: (product) => ({
                url: `/products/${product.id}/`,
                method: HttpMethod.PATCH,
                body: product,
            }),
            invalidatesTags: ["Product"],
        }),

        // delete Product
        deleteProduct: builder.mutation<void, number>({
            query: (id) => ({
                url: `/products/${id}/`,
                method: HttpMethod.DELETE,
            }),
            invalidatesTags: ["Product"],
        }),
    })

});

export const {
    useGetProductsQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation
} = productApiSlice