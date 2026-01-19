import { baseApi } from "./baseApiSlice";
import { HttpMethod } from "../../constants";
import type { DropDownListApiResponse, DropDownListData } from "../../types/dropDown";

export const dropDownApiSlice = baseApi.injectEndpoints({
   
    endpoints: (builder) => ({
        // Get dropdown data for vendors and products
        getDropDownListData: builder.query<DropDownListData, void>({
            query: () => ({
                url: "/products/get_dropdown_data/",
                method: HttpMethod.GET,
            }),
            transformResponse: (response: DropDownListApiResponse) => response.data,
            providesTags: ["DropDown"],
        }), 
    }),
});

export const {
    useGetDropDownListDataQuery,
} = dropDownApiSlice;