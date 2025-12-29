import { useState } from 'react';
import { Modal } from '../Modal';
import { FormField, Input, TextArea, Select } from '../FormField';
import { Save, X, Search } from 'lucide-react';

interface ProductReturnModalProps {
  isOpen: boolean;
  onClose: () => void;
  
}

const mockProducts = [
  { value: '', label: 'Select Product' },
  { value: 'ACC-001', label: 'Premium Floor Mats (ACC-001)' },
  { value: 'ACC-045', label: 'LED Headlight Kit (ACC-045)' },
  { value: 'ACC-089', label: 'Car Cover Waterproof (ACC-089)' },
  { value: 'ACC-112', label: 'Phone Mount Magnetic (ACC-112)' },
  { value: 'ACC-156', label: 'Dash Camera HD (ACC-156)' },
  { value: 'ACC-201', label: 'Seat Covers Leather (ACC-201)' },
  { value: 'ACC-267', label: 'Tire Pressure Monitor (ACC-267)' },
  { value: 'ACC-298', label: 'Steering Wheel Cover (ACC-298)' },
];

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
  { value: 'vendor', label: 'Return to Vendor' },
  { value: 'write_off', label: 'Write Off' },
  { value: 'exchange', label: 'Exchange' },
];

export function ProductReturnModal({ isOpen, onClose }: ProductReturnModalProps) {
  const [formData, setFormData] = useState({
    productSku: '',
    quantity: '',
    returnType: 'vendor',
    reason: '',
    billNumber: '',
    customerName: '',
    refundAmount: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (name === 'productSku' && value) {
      // Mock product data lookup
      setSelectedProduct({
        name: mockProducts.find(p => p.value === value)?.label || '',
        stock: 45,
        price: 1200,
      });
    }
    
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.productSku) newErrors.productSku = 'Product is required';
    if (!formData.quantity || Number(formData.quantity) <= 0)
      newErrors.quantity = 'Valid quantity is required';
    if (!formData.reason) newErrors.reason = 'Return reason is required';
    
    if (formData.returnType === 'vendor' && !formData.billNumber.trim())
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
      productSku: '',
      quantity: '',
      returnType: 'vendor',
      reason: '',
      billNumber: '',
      customerName: '',
      refundAmount: '',
      notes: '',
    });
    setSelectedProduct(null);
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
              <FormField label="Select Product" required error={errors.productSku}>
                <Select
                  name="productSku"
                  value={formData.productSku}
                  onChange={handleChange}
                  options={mockProducts}
                  error={!!errors.productSku}
                />
              </FormField>
            </div>

            {selectedProduct && (
              <div className="md:col-span-2 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Current Stock</p>
                    <p className="text-blue-700 mt-1">{selectedProduct.stock} units</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Unit Price</p>
                    <p className="text-blue-700 mt-1">₹{selectedProduct.price.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total Value</p>
                    <p className="text-blue-700 mt-1">
                      ₹{(selectedProduct.price * (Number(formData.quantity) || 0)).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            )}

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

            <FormField label="Return Type" required>
              <Select
                name="returnType"
                value={formData.returnType}
                onChange={handleChange}
                options={returnTypes}
              />
            </FormField>
          </div>
        </div>

        {/* Return Details */}
        <div>
          <h4 className="mb-4 pb-2 border-b border-border">Return Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField label="Return Reason" required error={errors.reason}>
              <Select
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                options={returnReasons}
                error={!!errors.reason}
              />
            </FormField>

            {formData.returnType === 'vendor' && (
              <FormField label="Original Bill Number" required={formData.returnType === 'vendor'} error={errors.billNumber}>
                <Input
                  name="billNumber"
                  value={formData.billNumber}
                  onChange={handleChange}
                  placeholder="e.g., PO-1234"
                  error={!!errors.billNumber}
                />
              </FormField>
            )}

            <FormField label="Customer Name">
              <Input
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                placeholder="Enter customer name (if applicable)"
              />
            </FormField>

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
        {selectedProduct && formData.quantity && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h4 className="text-amber-900 mb-3">Return Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-amber-700">Product:</span>
                <span className="text-amber-900">{selectedProduct.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-amber-700">Quantity:</span>
                <span className="text-amber-900">{formData.quantity} units</span>
              </div>
              <div className="flex justify-between">
                <span className="text-amber-700">Return Type:</span>
                <span className="text-amber-900 capitalize">
                  {returnTypes.find(t => t.value === formData.returnType)?.label}
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
