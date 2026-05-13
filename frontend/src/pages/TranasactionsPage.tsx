
import { useState } from 'react';
import { FormField, Input, SearchableSelect, Select } from '../components/FormField';
import { Trash, Save } from 'lucide-react';
import { useDropDownData } from '../hooks/dropDown';
import type { DropDownListData } from '../types/dropDown';
import { toast } from 'react-toastify';
import { useTransactionsData } from '../hooks/transactions';
import { getUserFriendlyError } from '../utils/errorHelper';


const transactionOptions = [
    { value: 'INCOME', label: 'Income' },
    { value: 'EXPENSE', label: 'Expense' },
];


const itemTypeOptions = [
    { value: 'PRODUCT', label: 'Product' },
    { value: 'SERVICE', label: 'Service' },
];


const emptyRows = {
    product: "",
    item_name: "",
    item_type: "",
    quantity: "",
    price: "",
};


export default function TransactionsPage() {

    const { data: dropDownData } = useDropDownData();
    const products: DropDownListData['products'] = dropDownData?.products || [];

    const { isCreating, createTransactions } = useTransactionsData();

    const [formData, setFormData] = useState({
        transaction_type: '',
        date: new Date().toISOString().split("T")[0],
        item_type: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const [rows, setRows] = useState([emptyRows]);

    //add new row
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Enter") {
            e.preventDefault();


            const currentRow = rows[index];

            //Prevent adding new row if current row is empty
            const hasEmptyRow = rows.some((row) => {
                if (row.item_type === "PRODUCT") {
                    return !row.product;
                }
                return !row.item_name;
            });

            if (hasEmptyRow) {
                toast.error("Please fill out the current row before adding a new one.");
                return;
            }


            if (!hasEmptyRow) {
                const price = Number(currentRow.price);
                const isDuplicateProduct = rows.some((row, i) => row.product === currentRow.product && row.product !== "" && i !== index);

                if (isDuplicateProduct) {
                    toast.error("Product already exists.");
                    return;
                }
                if (isNaN(price) || price <= 0) {
                    toast.error("Please enter a valid price before adding a new row.");
                    return;
                }

                if (currentRow.product && Number(currentRow.quantity) <= 0) {
                    toast.error("Please enter a valid quantity before adding a new row.");
                }
            }


            setRows([
                ...rows,
                emptyRows,
            ]);
        }
    };


    // Remove row
    const removeRow = (index: number) => {
        if (rows.length === 1) return; // Prevent removing the last row
        setRows(rows.filter((_, i) => i !== index));
    };


    // Handle change for dynamic rows
    const handleRowChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        index: number
    ) => {
        const { name, value } = e.target;

        const updatedRows = [...rows];
        updatedRows[index] = {
            ...updatedRows[index],
            [name]: value
        };

        setRows(updatedRows);
    };

    const handleProductSelect = (index: number, value: string) => {
        const updated = [...rows];

        updated[index] = {
            ...updated[index],
            product: value,
            item_name: "",
            item_type: "PRODUCT",
        };

        console.log("Selected product ID:", value);
        setRows(updated);
    };


    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.transaction_type.trim())
            newErrors.transaction_type = 'Valid transaction type is required';

        if (!formData.date.trim())
            newErrors.date = 'Valid date is required';

        if (formData.transaction_type === "INCOME" && !formData.item_type.trim()) {
            newErrors.item_type = 'Valid item type is required';
        }

        rows.forEach((rows) => {
            if (rows.product?.length === 0 && rows.item_name?.length === 0) {
                toast.error("please fill out the fields");
            }

        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const transactionTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;

        setFormData({
            ...formData,
            transaction_type: val,
            item_type: "",
        });

        // Reset rows when transaction type changes
        setRows([emptyRows]);
    }

    const handleItemTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;

        setFormData({
            ...formData,
            item_type: value,
        });

        const updatedRows = rows.map((row) => ({
            ...row,
            product: value === "PRODUCT" ? row.product : "",
            item_type: value === "SERVICE" ? "SERVICE" : value === "PRODUCT" ? row.item_type : "OTHER",
        }));

        setRows(updatedRows);
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }


        try {
            const payload = {
                transaction_type: formData.transaction_type,
                date: formData.date,

                items: rows.map((row) => ({
                    product: row.product,
                    item_name: row.item_name,
                    item_type: formData.transaction_type === "EXPENSE" ? "OTHER" : row.item_type,
                    quantity: Number(row.quantity) || 0,
                    price: Number(row.price) || 0,
                }))
            };

            console.log("Submitting payload:", payload);

            await createTransactions(payload).unwrap();
            toast.success("Transaction created successfully!");
            setRows([emptyRows]);
            setFormData({
                transaction_type: '',
                date: new Date().toISOString().split("T")[0],
                item_type: '',
            });
        } catch (err) {
            const errorMessage = getUserFriendlyError(err, 'Unable to generate bill.');
            toast.error(errorMessage);
            console.error("Error details:", err);
        }


    }



    return (
        <div className="p-4 lg:p-6">

            <div className="mb-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-card rounded-xl p-4 lg:p-5 border border-border shadow-sm mb-6">
                        <div className={`grid grid-cols-1 ${formData.transaction_type === "INCOME" ? "md:grid-cols-3" : "md:grid-cols-2"} gap-5`}>

                            {/* Select */}
                            <FormField label="Select Transaction" required error={errors.transaction_type}>
                                <Select
                                    name="transaction_type"
                                    value={formData.transaction_type}
                                    onChange={transactionTypeChange}
                                    options={transactionOptions}
                                    error={!!errors.transaction_type}
                                />
                            </FormField>

                            {/* Item Type */}
                            {
                                formData.transaction_type === "INCOME" ? (

                                    <FormField label="Select Transaction" required error={errors.item_type}>
                                        <Select
                                            name="item_type"
                                            value={formData.item_type}
                                            onChange={handleItemTypeChange}
                                            options={itemTypeOptions}
                                            error={!!errors.item_type}
                                        />
                                    </FormField>

                                ) : null
                            }


                            {/* Date Input */}
                            <FormField label="Date" required error={errors.date}>
                                <Input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            date: e.target.value,
                                        })
                                    }
                                    error={!!errors.date}
                                />
                            </FormField>

                        </div>
                    </div>

                    <div className="bg-card rounded-xl p-4 lg:p-5 border border-border shadow-sm mb-6">
                        <div className="hidden lg:block bg-card rounded-xl border border-border shadow-sm overflow-hidden mb-6">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-muted/50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-sm text-muted-foreground">Item</th>
                                            <th className="px-4 py-3 text-left text-sm text-muted-foreground">Qty</th>
                                            <th className="px-4 py-3 text-left text-sm text-muted-foreground">Cost</th>
                                            <th className="px-4 py-3 text-left text-sm text-muted-foreground">Action</th>
                                        </tr>
                                    </thead>
                                </table>
                            </div>
                        </div>

                        {rows.map((row, index) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-6 gap-5 pb-2">
                                {/* Product Name */}
                                <FormField label="Item" compact required error={errors[`product_name_${index}`]}>
                                    {
                                        formData.transaction_type === 'INCOME' ? (
                                            formData.item_type === "PRODUCT" ? (
                                                <>
                                                    <SearchableSelect
                                                        name="product"
                                                        value={row.product}
                                                        onChange={(e) => {
                                                            handleProductSelect(
                                                                index,
                                                                e.target.value
                                                            );
                                                        }}
                                                        options={
                                                            products?.map((p) => ({
                                                                value: p.id.toString(),      // send ID
                                                                label: p.product_name,       // show Name
                                                            })) ?? []
                                                        }
                                                        isSearchable
                                                    />

                                                </>
                                            ) : (
                                                formData.item_type === "SERVICE" ? (
                                                    <Input
                                                        placeholder="Service name"
                                                        name='item_name'
                                                        value={row.item_name}
                                                        onChange={(e) =>
                                                            handleRowChange(e, index)
                                                        }
                                                    />
                                                ) : null
                                            )
                                        ) : (
                                            <Input
                                                placeholder="Expense name"
                                                name='item_name'
                                                value={row.item_name}
                                                onChange={(e) =>
                                                    handleRowChange(e, index)
                                                }
                                            />
                                        )
                                    }

                                </FormField>


                                {/* Stock Qty */}
                                <FormField label="Stock Qty" compact required error={errors[`stock_${index}`]}>
                                    <Input
                                        name="quantity"
                                        type="text"
                                        value={row.quantity}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            const numericValue = value.replace(/[^0-9]/g, '');
                                            e.target.value = numericValue;
                                            handleRowChange(e, index)
                                        }}
                                        placeholder="1"
                                        error={!!errors[`stock_${index}`]}
                                    />
                                </FormField>

                                {/* Selling Price */}
                                <FormField label="Selling Price" compact required error={errors[`price_${index}`]}>
                                    <Input
                                        name="price"
                                        type="text"
                                        value={row.price}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            const numericValue = value.replace(/[^0-9.]/g, '');
                                            e.target.value = numericValue;
                                            handleRowChange(e, index)
                                        }}
                                        placeholder="500.00"
                                        error={!!errors[`price_${index}`]}
                                        onKeyDown={(e) => handleKeyDown(e, index)}
                                    />
                                </FormField>


                                {/* Action Buttons */}
                                <button
                                    className="flex-1 sm:flex-none px-6 py-2.5 bg-rose-500 text-primary-foreground rounded-lg hover:bg-rose-600 transition-colors flex items-center justify-center gap-2"
                                    type="button"
                                    onClick={() => removeRow(index)}
                                >
                                    <Trash className="w-4 h-4" />
                                    Remove
                                </button>
                            </div>
                        ))}



                        <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-border">

                            <button
                                type="submit"
                                className="flex-1 sm:flex-none px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                            >
                                <Save className="w-4 h-4" />
                                {
                                    isCreating ? "Saving..." : "Save Transaction"
                                }

                            </button>
                        </div>


                    </div>


                </form>

            </div>

        </div>

    );
}