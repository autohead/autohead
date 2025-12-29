import {
    useGetVendorsQuery,
    useCreateVendorMutation,
    useUpdateVendorMutation,
    useDeleteVendorMutation
} from '../store/slices/vendorApiSlice';

export function useVendorData(page: number) {
    const { data, isLoading, isError , refetch } = useGetVendorsQuery({ page });
    const [createVendor, { isLoading: isCreating }] = useCreateVendorMutation();
    const [updateVendor, { isLoading: isUpdating }] = useUpdateVendorMutation();
    const [deleteVendor, { isLoading: isDeleting }] = useDeleteVendorMutation();

    return {
        data, isLoading, isError, refetch,

        isCreating, createVendor,

        isUpdating, updateVendor,
        
        isDeleting, deleteVendor
    };
}