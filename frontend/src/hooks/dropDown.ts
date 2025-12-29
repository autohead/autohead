import {
    useGetDropDownListDataQuery
} from "../store/slices/dropDownApiSlice";


export function useDropDownData() {
    
    const { data, isLoading, isError, refetch } = useGetDropDownListDataQuery();

    return {
        data, isLoading, isError, refetch
    };

}
