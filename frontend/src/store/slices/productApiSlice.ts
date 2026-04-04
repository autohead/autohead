import { baseApi } from "./baseApiSlice";

import { HttpMethod } from "../../constants";
import type { ProductListApiResponse, ProductListData, Product, ProductAnalysisApiResponse, ProductFormValues  } from "../../types/product";


export const productApiSlice = baseApi.injectEndpoints({
  
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

       
        createProduct: builder.mutation<Product, ProductFormValues>({
            query: (product) => ({
                url: "/products/",
                method: HttpMethod.POST,
                body: product,
            }),
            invalidatesTags: ["Product", "Vendor", "DropDown"],
        }),

        // update Product
        updateProduct: builder.mutation<Product, {id: number,product: FormData}>({
            query: ({id, product}) => ({
                url: `/products/${id}/`,
                method: HttpMethod.PATCH,
                body: product,
            }),
            invalidatesTags: ["Product",  "DropDown"],
        }),

        // delete Product
        deleteProduct: builder.mutation<void, number>({
            query: (id) => ({
                url: `/products/${id}/`,
                method: HttpMethod.DELETE,
            }),
            invalidatesTags: ["Product", "DropDown"],
        }),


        // product sales analysis 
        getProductSalesAnalysis: builder.query<any, {id: number}>({
            query: ({id}) => {
                return {
                    url: `/products/${id}/sales-analysis/`,
                    method: HttpMethod.GET,
                };
            },
            transformResponse: (response: ProductAnalysisApiResponse) => response.data,
            providesTags: ["Product"],
        }),
    })

});

export const {
    useGetProductsQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
    useGetProductSalesAnalysisQuery
} = productApiSlice


