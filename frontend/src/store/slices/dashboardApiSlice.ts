import { baseApi } from "./baseApiSlice";
import { HttpMethod } from "../../constants";
import type { DashboardApiResponse, DashboardData } from "../../types/dashboard";

export const dashboardApiSlice = baseApi.injectEndpoints({
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