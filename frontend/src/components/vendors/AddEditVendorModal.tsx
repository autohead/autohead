import { useState } from 'react';
import { Modal } from '../Modal';
import { FormField, Input } from '../FormField';
import { Save, X } from 'lucide-react';
import type { VendorResponse } from '../../types/vendor';


interface AddEditVendorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (vendor: any) => void;
  isSaving: boolean;
  mode: 'add' | 'edit';
  vendors?: VendorResponse | null
}


export function AddEditVendorModal({ isOpen, onClose, onSave, isSaving, mode, vendors }: AddEditVendorModalProps) {


  const [formData, setFormData] = useState({
    name: vendors?.name || '',
    phone: vendors?.phone || '',
  });



  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Vendor name is required';

    if (!formData.phone) newErrors.phone = 'Phone number is required';
    else if (Number.isInteger(formData.phone) || formData.phone.toString().length !== 10)
      newErrors.phone = 'Invalid phone number';

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
        console.error('Error saving vendor:', error);
      }
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      phone: "",
    });
    setErrors({});
    onClose();
  };


  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={ mode === 'add' ? 'Add Vendor' : 'Edit Vendor' } size="sm">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <FormField label="Vendor Name" required error={errors.name}>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., AutoParts Pro"
                  error={!!errors.name}
                />
              </FormField>



            <FormField label="Phone Number" required error={errors.phone}>
              <Input
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                error={!!errors.phone}
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
            disabled={isSaving}
            className="flex-1 sm:flex-none px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            {isSaving
            ? mode === "add"
              ? "Saving..."
              : "Updating..."
            : mode === "add"
              ? "Save Vendor"
              : "Update Vendor"}

          </button>
        </div>
      </form>
    </Modal>
  );
}