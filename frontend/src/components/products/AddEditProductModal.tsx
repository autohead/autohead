import { useState, useEffect } from 'react';
import { Modal } from '../Modal';
import { FormField, Input, TextArea, Select, ImageInput } from '../FormField';
import { Save, X } from 'lucide-react';
import type { Product, Category, } from '../../types/product';


interface AddEditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'add' | 'edit';
  onSave: (product: any) => void;
  isSaving: boolean
  products?: Product | null;
  categories?: Category[];
}






export function AddEditProductModal({ isOpen, onClose, onSave, mode, products, isSaving, categories }: AddEditProductModalProps) {
  const [formData, setFormData] = useState({
    product_name: '',
    product_code: '',
    category: '',
    description: '',
  });

  useEffect(() => {
    if (products) {
      setFormData({
        product_name: products.product_name ?? '',
        product_code: products.product_code ?? '',
        category: String(products.category_detail?.id ?? ""),
        description: products.description ?? '',
      });
    }
  }, [products]);


  const [image, setImage] = useState(products?.image_url || '');


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
  };



  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.product_name.trim())
      newErrors.product_name = 'Product name is required';

    if (!formData.product_code.trim())
      newErrors.product_code = 'Product code is required';

    if (!formData.category)
      newErrors.category = 'Category is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        await onSave(formData);
        handleClose();
      } catch (error) {
        console.error('Error saving product:', error);
      }
    }
  };




  const handleClose = () => {
    setFormData({
      product_name: '',
      product_code: '',
      category: '',
      description: '',
    });
    setImage('');
    setErrors({});
    onClose();
  };


  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add New Product" size="lg">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Product Name */}
          <FormField label="Product Name" required error={errors.product_name}>
            <Input
              name="product_name"
              value={formData.product_name}
              onChange={handleChange}
              placeholder="e.g., Premium Floor Mats"
              error={!!errors.name}
            />
          </FormField>

          {/* SKU */}
          <FormField label="Product Code" required error={errors.product_code}>
            <Input
              name="product_code"
              value={formData.product_code}
              onChange={handleChange}
              placeholder="e.g., ACC-001"
              error={!!errors.product_code}
            />
          </FormField>

          {/* Category */}
          <FormField label="Category" required error={errors.category}>
            <Select
              name="category"
              value={formData.category}
              onChange={handleChange}
              options={categories?.map((cat) => ({
                value: cat.id.toString(),
                label: cat.name,
              })) ?? []}
              error={!!errors.category}
            />
          </FormField>

          <FormField label="Product Image" required >
            <ImageInput
              value={image}
              onChange={(url, file) => {
                setImage(url ?? '');

                setFormData((prev) => ({
                  ...prev,
                  image: file ?? null,
                }));
              }}
            />
          </FormField>

        </div>

        {/* Description */}
        <FormField label="Description">
          <TextArea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter product description..."
            rows={4}
          />
        </FormField>

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