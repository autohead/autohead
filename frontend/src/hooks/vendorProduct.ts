import { useCreateVendorProductMutation, useUpdateVendorProductStockMutation } from "../store/slices/vendorProductsApiSlice";

export const useVendorProductData = () => {

    const [createVendorProductData, { isLoading: isCreating }] = useCreateVendorProductMutation();
    const [updateVendorProductStock, { isLoading: isUpdating }] = useUpdateVendorProductStockMutation();

    return {
        createVendorProductData, isCreating,
        updateVendorProductStock, isUpdating
    }
}




