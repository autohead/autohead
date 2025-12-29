import { useState, useMemo, useEffect } from 'react';
import { Modal } from '../Modal';
import { FormField, Input, Select } from '../FormField';
import { Save, X } from 'lucide-react';
import type { DropDownListData } from '../../types/dropDown';
import { useDropDownData } from '../../hooks/dropDown';
import { useVendorData } from '../../hooks/vendor';
import { useVendorProductData } from '../../hooks/vendorProduct';
import { toast } from 'react-toastify';
import { getUserFriendlyError } from '../../utils/errorHelper'



interface AddEditVendorProductModalProps {
    isOpen: boolean;
    onClose: () => void;
}


export function ProductStockAdjustmentModal({ isOpen, onClose }: AddEditVendorProductModalProps) {

    const { data, isLoading, refetch: dropDownRefetch,} = useDropDownData();
    const { refetch: vendorRefetch } = useVendorData(1);
    const { updateVendorProductStock, isUpdating } = useVendorProductData()

    // const vendors: DropDownListData['vendors'] = data?.vendors || [];
    const products: DropDownListData['products'] = data?.products || [];
    const vendorProducts: DropDownListData['vendor_products'] = data?.vendor_products || [];


    const [formData, setFormData] = useState({
        vendor: "",
        stock: 0,
        product: "",
    });

    // Return Vendor to empty when Product changes
    useEffect(() => {
        setFormData(prev => ({ ...prev, vendor: "" }));
    }, [formData.product]);


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

    const filteredVendors = useMemo(() => {
        if (!formData.product) return [];

        return vendorProducts.filter(
            vp => vp.product.toString() === formData.product
        );
    }, [vendorProducts, formData.product]);


    const selectedVendorProduct = useMemo(() => {
        if (!formData.product || !formData.vendor) return null;

        return vendorProducts.find(
            vp =>
                vp.product.toString() === formData.product &&
                vp.vendor.toString() === formData.vendor
        );
    }, [vendorProducts, formData.product, formData.vendor]);


    const availableStock = selectedVendorProduct?.stock ?? 0;
    const vendorProductId = selectedVendorProduct?.id ?? "";



    const validateForm = () => {

        const stock = Number(formData.stock);
        const newErrors: Record<string, string> = {};
        if (!formData.product) newErrors.product = 'Product is required';
        if (!formData.vendor) newErrors.vendor = 'Vendor is required';
        if (stock <= 0) newErrors.stock = 'Stock should be greater than zero';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            console.log("Form Data Submitted:", formData);
            try {

                await updateVendorProductStock({
                    id: Number(vendorProductId),
                    stock: Number(formData.stock),
                }).unwrap();
                
                await dropDownRefetch();
                await vendorRefetch();

                toast.success("Stock adjustment Created Successfully", { autoClose: 2000 })
                handleClose();
            } catch (err) {
                const errorMessage = getUserFriendlyError(err, 'Failed to update stock. Please try again.');
                toast.error(errorMessage, { autoClose: 2000 });
            }
        }
    };

    const handleClose = () => {
        setFormData({
            vendor: '',
            product: '',
            stock: 0,
        });
        setErrors({});
        onClose();
    };



    if (isLoading) {
        return <div>Loading...</div>;
    }


    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Adjust Stock" size="md">
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

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

                        <FormField label="Vendor" required error={errors.vendor}>
                            <Select
                                name="vendor"
                                value={formData.vendor}
                                disabled={!formData.product}
                                onChange={handleChange}
                                options={filteredVendors?.map((cat) => ({
                                    value: cat.vendor.toString(),
                                    label: cat.vendor_detail?.name || "Unknown Vendor",
                                })) ?? []}
                                error={!!errors.vendor}
                            />
                        </FormField>

                        <FormField label="Available Stock" required error={errors.cost}>
                            <Input
                                value={availableStock}
                                placeholder="500.00"
                                readOnly
                            />
                        </FormField>


                        <FormField label="Adjust Stock" required error={errors.stock}>
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
                        disabled={isUpdating}
                        className="flex-1 sm:flex-none px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                    >
                        <Save className="w-4 h-4" />
                        {isUpdating
                            ? "Saving..."
                            : "Save"}

                    </button>
                </div>
            </form>
        </Modal>
    );
}