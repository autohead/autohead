import { useMemo, useState, useEffect } from 'react';
import { Modal } from '../Modal';
import { FormField, Input, TextArea, Select } from '../FormField';
import { Save, X, Search } from 'lucide-react';
import { useDropDownData } from '../../hooks/dropDown';
import type { DropDownListData } from '../../types/dropDown';


interface ProductReturnModalProps {
  isOpen: boolean;
  onClose: () => void;

}


const returnReasons = [
  { value: '', label: 'Select Reason' },
  { value: 'defective', label: 'Defective/Damaged' },
  { value: 'wrong_product', label: 'Wrong Product Received' },
  { value: 'quality_issue', label: 'Quality Issue' },
  { value: 'excess_stock', label: 'Excess Stock' },
  { value: 'customer_return', label: 'Customer Return' },
  { value: 'other', label: 'Other' },
];

const returnTypes = [
  { value: '1', label: 'Sold' },
  { value: '2', label: 'Not Sold' },
];

export function ProductReturnModal({ isOpen, onClose }: ProductReturnModalProps) {

  const { data, isLoading } = useDropDownData();

  const products: DropDownListData['products'] = data?.products || [];
  const vendorProducts: DropDownListData['vendor_products'] = data?.vendor_products || [];

  const [formData, setFormData] = useState({
    product: '',
    vendor: '',
    quantity: '',
    return_type: '',
    reason: '',
    billNumber: '',
    customerName: '',
    refundAmount: '',
    notes: '',
  });

  // Return Vendor to empty when Product changes
  useEffect(() => {
    setFormData(prev => ({ ...prev, vendor: "" }));
   
  }, [formData.product]);


  const [errors, setErrors] = useState<Record<string, string>>({});
 



  // Product
  const selectedProduct = useMemo(() => {
    return products.find((p) => p.id.toString() === formData.product);
  }, [products, formData.product]);

  // Vendors
  const filteredVendors = useMemo(() => {
    if (!formData.product) return [];
    return vendorProducts.filter((vp) => vp.product.toString() === formData.product);
  }, [formData.product, vendorProducts]);

  // Vendor Product
  const selectedVendorProduct = useMemo(() => {
    if (!formData.product || !formData.vendor) return null;

    return vendorProducts.find(
      vp =>
        vp.product.toString() === formData.product &&
        vp.vendor.toString() === formData.vendor

    );
  }, [vendorProducts, formData.product, formData.vendor]);

  const vendorProductId = selectedVendorProduct?.id ?? "";
  const stock = selectedVendorProduct?.stock ?? 0;
  const price = selectedVendorProduct?.price ?? 0;
  const productName = selectedProduct?.product_name ?? '';



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
    const newErrors: Record<string, string> = {};

    if (!formData.product) newErrors.product = 'Product is required';
    if (!formData.quantity || Number(formData.quantity) <= 0)
      newErrors.quantity = 'Valid quantity is required';
    if (!formData.reason) newErrors.reason = 'Return reason is required';

    if (formData.return_type === '1' && !formData.billNumber.trim())
      newErrors.billNumber = 'Bill number is required for vendor returns';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Form submitted with data:', formData);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      product: '',
      vendor: '',
      quantity: '',
      return_type: '',
      reason: '',
      billNumber: '',
      customerName: '',
      refundAmount: '',
      notes: '',
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Product Return" size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Selection */}
        <div>
          <h4 className="mb-4 pb-2 border-b border-border">Product Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <FormField label="Select Product" required error={errors.product}>
                <Select
                  name="product"
                  value={formData.product}
                  onChange={handleChange}
                  options={products?.map((cat) => ({
                    value: cat.id.toString(),
                    label: cat.product_name,
                  })) ?? []}
                />
              </FormField>
            </div>




            <FormField label="Vendor" required>
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

            <FormField label="Return Quantity" required error={errors.quantity}>
              <Input
                name="quantity"
                type="number"
                min="1"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="Enter quantity"
                error={!!errors.quantity}
              />
            </FormField>

            {selectedVendorProduct  && (
              <div className="md:col-span-2 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Current Stock</p>
                    <p className="text-blue-700 mt-1">{stock} units</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Unit Price</p>
                    <p className="text-blue-700 mt-1">₹{price.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total Value</p>
                    <p className="text-blue-700 mt-1">
                      ₹{(price * (Number(formData.quantity) || 0)).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            )}


          </div>
        </div>

        {/* Return Details */}
        <div>
          <h4 className="mb-4 pb-2 border-b border-border">Return Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField label="Return Type" required error={errors.returnType}>
              <Select
                name="return_type"
                value={formData.return_type}
                onChange={handleChange}
                options={returnTypes}
                error={!!errors.reason}
              />
            </FormField>

            {formData.return_type === '1' && (
              <FormField label="Original Bill Number" required={formData.return_type === '1'} error={errors.billNumber}>
                <Input
                  name="billNumber"
                  value={formData.billNumber}
                  onChange={handleChange}
                  placeholder="e.g., PO-1234"
                  error={!!errors.billNumber}
                />
              </FormField>
            )}

            {formData.return_type === '1' && (
            <FormField label="Customer Name">
              <Input
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                placeholder="Enter customer name (if applicable)"
              />
            </FormField>
            )}

            <FormField label="Refund Amount (₹)">
              <Input
                name="refundAmount"
                type="number"
                min="0"
                step="0.01"
                value={formData.refundAmount}
                onChange={handleChange}
                placeholder="0.00"
              />
            </FormField>
          </div>
        </div>

        {/* Additional Notes */}
        <FormField label="Additional Notes">
          <TextArea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Enter any additional details about this return..."
            rows={4}
          />
        </FormField>

        {/* Summary */}
        {selectedVendorProduct  && formData.quantity && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h4 className="text-amber-900 mb-3">Return Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-amber-700">Product:</span>
                <span className="text-amber-900">{productName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-amber-700">Quantity:</span>
                <span className="text-amber-900">{formData.quantity} units</span>
              </div>
              <div className="flex justify-between">
                <span className="text-amber-700">Return Type:</span>
                <span className="text-amber-900 capitalize">
                  {returnTypes.find(t => t.value === formData.return_type)?.label}
                </span>
              </div>
              {formData.refundAmount && (
                <div className="flex justify-between pt-2 border-t border-amber-300">
                  <span className="text-amber-700">Refund Amount:</span>
                  <span className="text-amber-900">₹{Number(formData.refundAmount).toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>
        )}

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
            className="flex-1 sm:flex-none px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            Process Return
          </button>
        </div>
      </form>
    </Modal>
  );
}
