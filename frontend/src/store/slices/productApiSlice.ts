import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithAuthCheck from "../baseQueryWithAuthCheck";
import { HttpMethod } from "../../constants";
import type { ProductListApiResponse, ProductListData, Product, ProductAnalysisApiResponse  } from "../../types/product";


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



// services/baseApi.ts
// import { createApi } from '@reduxjs/toolkit/query/react';

// export const baseApi = createApi({
//   reducerPath: 'api',
//   baseQuery: baseQueryWithAuthCheck,
//   tagTypes: ['Category', 'Product'],
//   endpoints: () => ({}),
// });


// services/categoryApi.ts
// import { baseApi } from './baseApi';

// export const categoryApi = baseApi.injectEndpoints({
//   endpoints: (builder) => ({
//     getCategories: builder.query<CategoryResponse[], void>({
//       query: () => ({
//         url: '/categories/',
//         method: HttpMethod.GET,
//       }),
//       transformResponse: (res: CategoryListResponse) => res.data,
//       providesTags: ['Category'],
//     }),

//     createCategory: builder.mutation<any, CreateCategoryPayload>({
//       query: (body) => ({
//         url: '/categories/',
//         method: HttpMethod.POST,
//         body,
//       }),
//       invalidatesTags: ['Category'], // 🎯 auto refetch
//     }),
//   }),
// });

// export const {
//   useGetCategoriesQuery,
//   useCreateCategoryMutation,
// } = categoryApi;

