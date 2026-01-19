import { useState } from 'react';
import { Modal } from '../Modal';
import { FormField, Input, Select } from '../FormField';
import { Save, X } from 'lucide-react';
import type { VendorProduct } from '../../types/vendorProduct';
import type { DropDownListData } from '../../types/dropDown';
import { useDropDownData } from '../../hooks/dropDown';
import { useVendorProductData } from '../../hooks/vendorProduct';
import { toast } from 'react-toastify';
import { getUserFriendlyError } from '../../utils/errorHelper'



interface AddEditVendorProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (vendor: any) => void;
    isSaving: boolean;
    mode: 'add' | 'edit';
    vendorProduct?: VendorProduct | null;
}


export function AddEditVendorProduct({ isOpen, onClose, mode, vendorProduct }: AddEditVendorProductModalProps) {

    const { data, isLoading } = useDropDownData();
    const { createVendorProductData, isCreating } = useVendorProductData()

    const vendors: DropDownListData['vendors'] = data?.vendors || [];
    const products: DropDownListData['products'] = data?.products || [];


    const [formData, setFormData] = useState({
        vendor: String(vendorProduct?.vendor || ''),
        vendor_code: vendorProduct?.vendor_code || '',
        price: vendorProduct?.price || 0,
        cost: vendorProduct?.cost || 0,
        stock: vendorProduct?.stock || 0,
        product: String(vendorProduct?.product || ''),
    });









    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const cost = Number(formData.cost);
        const price = Number(formData.price);
        const stock = Number(formData.stock);
        const newErrors: Record<string, string> = {};
        if (!formData.vendor) newErrors.vendor = 'Vendor is required';
        if (!formData.product) newErrors.product = 'Product is required';
        if (!formData.vendor_code.trim()) newErrors.vendor_code = 'Vendor code is required';
        if (price <= 0) newErrors.price = 'Price must be greater than zero';
        if (cost <= 0) newErrors.cost = 'Cost must be greater than zero';
        if (stock < 0) newErrors.stock = 'Stock cannot be negative';

        if (
            price > 0 &&
            cost > 0 &&
            cost > price
        ) {
            newErrors.cost = 'Cost cannot be greater than price';
            newErrors.price = 'Price cannot be less than cost';
        }


        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            console.log("Form Data Submitted:", formData);
            try {
                await createVendorProductData(formData).unwrap()
                toast.success("Vendor Product Created Successfully", { autoClose: 2000 })
                handleClose();
            } catch (err) {
                const errorMessage = getUserFriendlyError(err, 'Failed to add Vendor Product. Please try again.');
                toast.error(errorMessage, { autoClose: 2000 });
            }
        }
    };

    const handleClose = () => {
        setFormData({
            vendor: '',
            product: '',
            vendor_code: '',
            price: 0,
            cost: 0,
            stock: 0,
        });
        setErrors({});
        onClose();
    };



    if (isLoading) {
        return <div>Loading...</div>;
    }


    return (
        <Modal isOpen={isOpen} onClose={handleClose} title={mode === 'add' ? 'Add Vendor Product' : 'Edit Vendor Product'} size="md">
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div>
                    <h4 className="mb-4 pb-2 border-b border-border">Basic Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">



                        <FormField label="Vendor" required error={errors.vendor}>
                            <Select
                                name="vendor"
                                value={formData.vendor}
                                onChange={handleChange}
                                options={vendors?.map((cat) => ({
                                    value: cat.id.toString(),
                                    label: cat.name,
                                })) ?? []}
                                error={!!errors.vendor}
                            />
                        </FormField>


                        <FormField label="Product" required error={errors.product}>
                            <Select
                                name="product"
                                value={formData.product}
                                onChange={handleChange}
                                options={products?.map((cat) => ({
                                    value: cat.id.toString(),
                                    label: cat.product_name,
                                })) ?? []}
                                error={!!errors.product}
                            />
                        </FormField>


                        <FormField label="Vendor Code" required error={errors.vendor_code}>
                            <Input
                                name="vendor_code"
                                value={formData.vendor_code}
                                onChange={handleChange}
                                placeholder="VP-001"
                                error={!!errors.vendor_code}
                            />
                        </FormField>



                        <FormField label="Cost" required error={errors.cost}>
                            <Input
                                name="cost"
                                type="number"
                                value={formData.cost}
                                onChange={handleChange}
                                placeholder="500.00"
                                error={!!errors.cost}
                            />
                        </FormField>

                        <FormField label="Selling Price" required error={errors.price}>
                            <Input
                                name="price"
                                type="number"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="500.00"
                                error={!!errors.price}
                            />
                        </FormField>

                        <FormField label="Stock" required error={errors.stock}>
                            <Input
                                name="stock"
                                type="number"
                                value={formData.stock}
                                onChange={handleChange}
                                placeholder="50"
                                error={!!errors.stock}
                            />
                        </FormField>



                    </div>
                </div>


                {/* Action Buttons */}
                <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-border">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="flex-1 sm:flex-none px-6 py-2.5 border border-border rounded-lg hover:bg-accent transition-colors flex items-center justify-center gap-2"
                    >
                        <X className="w-4 h-4" />
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isCreating}
                        className="flex-1 sm:flex-none px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                    >
                        <Save className="w-4 h-4" />
                        {isCreating
                            ? mode === "add"
                                ? "Saving..."
                                : "Updating..."
                            : mode === "add"
                                ? "Save Vendor Product"
                                : "Update Vendor Product"}s

                    </button>
                </div>
            </form>
        </Modal>
    );
}