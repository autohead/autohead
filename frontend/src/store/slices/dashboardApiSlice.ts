import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithAuthCheck from "../baseQueryWithAuthCheck";
import { HttpMethod } from "../../constants";
import type { DashboardApiResponse, DashboardData } from "../../types/dashboard";

export const dashboardApiSlice = createApi({
    reducerPath: "dashboardApi",
    baseQuery: baseQueryWithAuthCheck,
    tagTypes: ["Dashboard"],
    endpoints: (builder) => ({
        getDashboardData: builder.query<DashboardData, void>({
            query: () => ({
                url: "/dashboard/",
                method: HttpMethod.GET,
            }),
            transformResponse: (response: DashboardApiResponse) => response.data,
            providesTags: ["Dashboard"],
        }),
    }),
});

export const {
    useGetDashboardDataQuery,
} = dashboardApiSlice