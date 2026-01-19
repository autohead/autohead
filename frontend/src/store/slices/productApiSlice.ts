import { baseApi } from "./baseApiSlice";

import { HttpMethod } from "../../constants";
import type { ProductListApiResponse, ProductListData, Product, ProductAnalysisApiResponse  } from "../../types/product";


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

        // create Product
        // Switched from ProductFormValues to FormData since this API call includes an image upload.
        // Plain objects cannot handle files; FormData is needed for multipart/form-data.
        createProduct: builder.mutation<Product, FormData>({
            query: (product) => ({
                url: "/products/",
                method: HttpMethod.POST,
                body: product,
            }),
            invalidatesTags: ["Product"],
        }),

        // update Product
        updateProduct: builder.mutation<Product, {id: number,product: FormData}>({
            query: ({id, product}) => ({
                url: `/products/${id}/`,
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


