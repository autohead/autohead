import { useState } from 'react';
import { Modal } from '../Modal';
import { FormField, Input, SearchableSelect } from '../FormField';
import { Save, X, Trash } from 'lucide-react';
import type { Product, ProductFormValues, Vendor } from '../../types/product';
import { toast } from 'react-toastify';



interface AddEditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'add' | 'edit';
  onSave: (product: any) => void;
  isSaving: boolean
  products?: Product[] | null;
  vendors?: Vendor[] | null;
}



export function AddEditProductModal({ isOpen, onClose, onSave, mode, products, isSaving, vendors }: AddEditProductModalProps) {
  const [formData, setFormData] = useState({
    vendor_name: '',
    vendor_contact: '',
  });

  const [rows, setRows] = useState([
    {
      product_name: '',
      product_code: '',
      stock: "",
      cost: "",
      price: "",
    }
  ])


  // Add new row on Enter key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Enter") {
      e.preventDefault();


      const currentRow = rows[index];

      // prevent adding any empty rows
      if (rows.some(row => !row.product_name || !row.product_code || !row.cost || !row.price)) {
        toast.error("Please fill all fields before adding a new row.");
        return;
      }

      // prevent duplicated product codes
      const isDuplicateCode = rows.some((row, i) => row.product_code === currentRow.product_code && i !== index);
      if (isDuplicateCode) {
        toast.error("Product code already exists.");
        return;
      }

      // prevent substracting more stock than existing quantity when editing an existing product
      const existingProduct = products?.find(p => p.product_code === currentRow.product_code);
      const totalStock = Number(currentRow.stock) + (existingProduct ? Number(existingProduct.stock) : 0);
      if (existingProduct && totalStock < 0) {
        toast.error("cannot reduce stock more than existing quantity.");
        return;
      }

      setRows([
        ...rows,
        {
          product_name: "",
          product_code: "",
          stock: "",
          cost: "",
          price: ""
        }
      ]);
    }
  }

  // Remove row
  const removeRow = (index: number) => {
    if (rows.length === 1) return; // Prevent removing the last row
    setRows(rows.filter((_, i) => i !== index));
  };


  const [errors, setErrors] = useState<Record<string, string>>({});


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    console.log(name, value);
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



  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (formData.vendor_name.trim() && !formData.vendor_contact.trim())
      newErrors.vendor_contact = 'Valid contact number is required';

    // if (!formData.vendor_contact.trim() || formData.vendor_contact.trim().length < 10)
    //   newErrors.vendor_contact = 'Valid contact number is required';

    rows.forEach((row, index) => {
      if (!row.product_name.trim())
        newErrors[`product_name_${index}`] = "Product name is required";

      if (!row.product_code.trim())
        newErrors[`product_code_${index}`] = "Product code is required";

      // if (!row.stock)
      //   newErrors[`stock_${index}`] = "Stock is required";

      if (!row.cost)
        newErrors[`cost_${index}`] = "Cost is required";

      if (!row.price)
        newErrors[`price_${index}`] = "Price is required";

      if (row.stock) {
        const existingProduct = products?.find(p => p.product_code === row.product_code);
        const totalStock = Number(row.stock) + (existingProduct ? Number(existingProduct.stock) : 0);
        if (existingProduct && totalStock < 0) {
          newErrors[`stock_${index}`] = "cannot reduce stock more than existing quantity.";
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    if (validateForm()) {
      const payload: ProductFormValues = {
        vendor_data: formData.vendor_name
          ? {
            name: formData.vendor_name,
            phone: formData.vendor_contact
          }
          : undefined,

        product_data: rows.map((row) => ({
          product_name: row.product_name,
          product_code: row.product_code,
          stock: isNaN(Number(row.stock)) ? 0 : Number(row.stock),
          cost: row.cost,
          selling_price: row.price
        }))
      };
      try {
        await onSave(payload);
        handleClose();
      } catch (error) {
        console.error('Error saving product:', error);
      }
    }
  };




  const handleClose = () => {
    setFormData({
      vendor_name: '',
      vendor_contact: '',
    });
    setRows([
      {
        product_name: '',
        product_code: '',
        stock: "",
        cost: "",
        price: "",
      }
    ]);
    setErrors({});
    onClose();
  };


  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={mode === 'add' ? 'Add Product' : 'Edit Product'} size="xl">
      <form onSubmit={handleSubmit} className="space-y-5 ">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 border-b border-border pb-5">

          {/* Vendor Name */}
          <FormField label="Vendor Name" required error={errors.vendor_name}>
            <SearchableSelect
              name="vendor_name"
              value={formData.vendor_name}
              onChange={(e) => {
                const vendorName = e.target.value;

                if (!vendorName) {
                  setFormData((prev) => ({
                    ...prev,
                    vendor_name: "",
                    vendor_contact: "",
                  }));
                  return;
                }

                const vendor = vendors?.find((v) => v.name === vendorName);

                setFormData((prev) => ({
                  ...prev,
                  vendor_name: vendor?.name || vendorName,
                  vendor_contact: vendor?.phone || "",
                }));
              }}
              options={
                vendors?.map((vendor) => ({
                  value: vendor.name,
                  label: vendor.name,
                })) ?? []
              }
              error={!!errors.vendor_name}
              isSearchable
            />
          </FormField>


          {/* Vendor Contacts */}
          <FormField label="Contact Number" required error={errors.vendor_contact}>
            <Input
              type="text"
              name="vendor_contact"
              maxLength={10}
              value={formData.vendor_contact}
              onChange={
                (e) => {
                  let numericValue = e.target.value.replace(/[^0-9]/g, '');
                  numericValue = numericValue.slice(0, 10);
                  setFormData((prev) => ({
                    ...prev,
                    vendor_contact: numericValue,
                  }));
                }
              }
              placeholder="+91 1234567890"
              error={!!errors.vendor_contact}
            />
          </FormField>

        </div>


        {/* Heading Table */}
        <div className="hidden lg:block bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm text-muted-foreground">Product Name</th>
                  <th className="px-4 py-3 text-left text-sm text-muted-foreground">Product Code</th>
                  <th className="px-4 py-3 text-left text-sm text-muted-foreground">Stock Qty</th>
                  <th className="px-4 py-3 text-left text-sm text-muted-foreground">Cost</th>
                  <th className="px-4 py-3 text-left text-sm text-muted-foreground">Selling Price</th>
                  <th className="px-4 py-3 text-left text-sm text-muted-foreground">Action</th>
                </tr>
              </thead>
            </table>
          </div>
        </div>

        {rows.map((formData, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-6 gap-5 pb-2">
            {/* Product Name */}
            <FormField label="Product Name" compact required error={errors[`product_name_${index}`]}>
              <SearchableSelect
                name="product_name"
                value={formData.product_name}
                onChange={(e) => {
                  const productName = e.target.value;

                  if (!productName) {
                    setRows((prev) => {
                      const updated = [...prev];
                      updated[index] = {
                        ...updated[index],
                        product_name: "",
                        product_code: "",
                        stock: "",
                        cost: "",
                        price: "",
                      };
                      return updated;
                    });
                    return;
                  }

                  const product = products?.find((p) => p.product_name === productName);

                  setRows((prev) => {
                    const updated = [...prev];
                    updated[index] = {
                      ...updated[index],
                      product_name: product?.product_name || productName,
                      product_code: product?.product_code || "",
                      stock: '',
                      cost: product ? String(product.cost) : "",
                      price: product ? String(product.price) : "",
                    };
                    return updated;
                  })
                }}
                options={products?.map((cat) => ({
                  value: cat.product_name,
                  label: cat.product_name,
                })) ?? []}
                error={!!errors[`product_name_${index}`]}
                isSearchable
              />
            </FormField>

            {/* Product Code */}
            <FormField label="Product Code" compact required error={errors[`product_code_${index}`]}>
              <Input
                name="product_code"
                value={formData.product_code}
                onChange={(e) => handleRowChange(e, index)}
                placeholder="e.g., ACC-001"
                error={!!errors[`product_code_${index}`]}
              />
            </FormField>

            {/* Stock Qty */}
            <FormField label="Stock Qty" compact required error={errors[`stock_${index}`]}>
              <Input
                name="stock"
                type="number"
                value={formData.stock}
                onChange={(e) => {
                  const value = e.target.value;
                  const numericValue = value.replace(/[^0-9.]/g, '');
                  e.target.value = numericValue;
                  handleRowChange(e, index)
                }}
                placeholder="50 NOS"
                error={!!errors[`stock_${index}`]}
              />
            </FormField>

            {/* Cost */}
            <FormField label="Cost" compact required error={errors[`cost_${index}`]}>
              <Input
                name="cost"
                type="text"
                value={formData.cost}
                onChange={(e) => {
                  const value = e.target.value;
                  const numericValue = value.replace(/[^0-9.]/g, '');
                  e.target.value = numericValue;
                  handleRowChange(e, index)
                }}
                placeholder="500.00"
                error={!!errors[`cost_${index}`]}
              />
            </FormField>

            {/* Selling Price */}
            <FormField label="Selling Price" compact required error={errors[`price_${index}`]}>
              <Input
                name="price"
                type="text"
                value={formData.price}
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
            {
              isSaving ? mode === 'add' ?
                'Adding...' : 'Updating...'
                : mode === 'add' ?
                  'Add Product' : 'Update Product'
            }

          </button>
        </div>
      </form>
    </Modal>
  );
}