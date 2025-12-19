import {
    useCreateProductMutation,
    useDeleteProductMutation,
    useGetProductsQuery,
    useUpdateProductMutation
} from "../store/slices/productApiSlice";


export function useProductData(page: number) {
    const { data, isLoading, isError } = useGetProductsQuery({ page });
    const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
    const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
    const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

    return {
        data, isLoading, isError,

        isCreating, createProduct,

        isUpdating, updateProduct,

        isDeleting, deleteProduct
    };
}