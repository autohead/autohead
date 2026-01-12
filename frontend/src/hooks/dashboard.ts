import { useGetDashboardDataQuery } from "../store/slices/dashboardApiSlice";


export function useDashboardData() {
    const {data , isLoading, isError} = useGetDashboardDataQuery();
    return {data, isLoading, isError};
}