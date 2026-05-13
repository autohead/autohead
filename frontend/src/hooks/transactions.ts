import { useCreateTransactionsMutation } from "../store/slices/transactionsApliSlice";




export const useTransactionsData = () => {
    const [createTransactions, { isLoading: isCreating }] = useCreateTransactionsMutation();

    return {
        isCreating, createTransactions
    };
}