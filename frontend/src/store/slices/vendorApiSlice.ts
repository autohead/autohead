import { baseApi } from "./baseApiSlice";
import { HttpMethod } from "../../constants";
import type { VendorResponse, VendorListResponse, VendorFormData, VendorUpdateData,VendorPaginatedResponse  } from "../../types/vendor";


export const vendorApiSlice = baseApi.injectEndpoints({
    
    endpoints: (builder) => ({
        // Get all vendors
        getVendors: builder.query<VendorPaginatedResponse, {page?: number}>({
            query: ( {page = 1} ) => ({
                url: `/vendors/?page=${page}`,
                method: HttpMethod.GET,
            }),
            transformResponse: (response: VendorListResponse) => response.data,
            providesTags: ["Vendor"],
        }),

        // Create vendor
        createVendor: builder.mutation<VendorResponse, VendorFormData>({
            query: (vendor) => ({
                url: "/vendors/",
                method: HttpMethod.POST,
                body: vendor,
            }),
            invalidatesTags: ["Vendor", "DropDown"],
        }),

        // Update vendor
        updateVendor: builder.mutation<VendorResponse, VendorUpdateData>({
            query: (vendor) => ({
                url: `/vendors/${vendor.id}/`,
                method: HttpMethod.PATCH,
                body: vendor,
            }),
            invalidatesTags: ["Vendor"],
        }),

        deleteVendor: builder.mutation<void, number>({
            query: (id) => ({
                url: `/vendors/${id}/`,
                method: HttpMethod.DELETE,
            }),
            invalidatesTags: ["Vendor"],
        })
    }),
});

export const {
    useGetVendorsQuery,
    useCreateVendorMutation,
    useUpdateVendorMutation,
    useDeleteVendorMutation
} = vendorApiSlice;