import { useState } from 'react';
import { Modal } from '../Modal';
import {
  Package,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  TrendingUp,
  AlertCircle,
  Calendar,
  FileText
} from 'lucide-react';
import { AddEditVendorModal } from './AddEditVendorModal';
import type { VendorResponse, } from '../../types/vendor';
import type { FlatVendorForm } from '../../utils/vendorPayLoad';
import { useVendorData } from '../../hooks/vendor';
import { mapVendorFormToPayload } from '../../utils/vendorPayLoad';
import { toast } from 'react-toastify';


interface VendorDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendor: VendorResponse | null;
}

export function VendorDetailModal({ isOpen, onClose, vendor }: VendorDetailModalProps) {

  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const {
    updateVendor,
    isUpdating,
  } = useVendorData(1);

  console.log('VendorDetailModal vendor:', vendor);


  if (!vendor) return null;

  const outstandingBalance = 145000;

  const handleUpdateVendor = async (VendorData: FlatVendorForm) => {
    try {
      await updateVendor(
        {
          id: vendor.id,
          ...mapVendorFormToPayload(VendorData)
        }
      ).unwrap();
      toast.success('vendor updated successfully', { autoClose: 2000 });
      onClose();

    } catch (err: any) {
      const errorMessage =
        err?.data?.errors?.name?.[0] ||
        err?.data?.errors?.email?.[0] ||
        'Failed to update vendor. Please try again.';
      toast.error(errorMessage, { autoClose: 2000 });

    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Vendor Details" size="lg">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex items-start justify-between pb-5 border-b border-border">
          <div>
            <h3 className="text-foreground mb-2">{vendor.name}</h3>
            <div className="space-y-1.5 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span>{vendor.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>{vendor.email}</span>
              </div>
            </div>
          </div>
          <span className="px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-sm capitalize">
            {vendor.is_active ? 'active' : 'inactive'}
          </span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Products</p>
                <p className="text-blue-600">{vendor.vendor_products?.length || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Value</p>
                <p className="text-purple-600">₹0</p>
              </div>
            </div>
          </div>

          <div className={`${10 > 0 ? 'bg-amber-50' : 'bg-green-50'} rounded-xl p-4`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 ${10 > 0 ? 'bg-amber-100' : 'bg-green-100'} rounded-lg`}>
                <AlertCircle className={`w-5 h-5 ${10 > 0 ? 'text-amber-600' : 'text-green-600'}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Returns</p>
                <p className={10 > 0 ? 'text-amber-600' : 'text-green-600'}>
                  {10}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Calendar className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Txn</p>
                <p className="text-orange-600 text-sm">03/11/2000</p>
              </div>
            </div>
          </div>
        </div>

        {/* Vendor Information */}
        <div className="space-y-4">
          <h4>Vendor Information</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Outstanding Balance */}
            <div className="bg-accent/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <CreditCard className="w-4 h-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Outstanding Balance</p>
              </div>
              <p className="text-destructive">₹{outstandingBalance.toLocaleString()}</p>
            </div>

            {/* Credit Period */}
            <div className="bg-accent/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">Credit Period</p>
              <p>30 days</p>
            </div>

            {/* GST Number */}
            {vendor.gst_number && (
              <div className="bg-accent/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">GST Number</p>
                </div>
                <p className="text-sm">{vendor.gst_number}</p>
              </div>
            )}

            {/* Address */}
            {vendor.address && (
              <div className="bg-accent/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Address</p>
                </div>
                <p className="text-sm">{vendor.address}</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="pt-5 border-t border-border">
          <h4 className="mb-4">Vendor Products</h4>

          {/* Desktop Table View */}
          <div className="hidden lg:block bg-card rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm text-muted-foreground">Product Name</th>
                    <th className="px-4 py-3 text-left text-sm text-muted-foreground">Vendor Code</th>
                    <th className="px-4 py-3 text-left text-sm text-muted-foreground">Cost</th>
                    <th className="px-4 py-3 text-left text-sm text-muted-foreground">Price</th>
                    <th className="px-4 py-3 text-left text-sm text-muted-foreground">Stock</th>


                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {vendor.vendor_products?.map((v) => (
                    <tr key={v.id} className="hover:bg-accent/50 transition-colors">
                      <td className="px-4 py-3.5">{v.product_detail?.product_name}</td>
                      <td className="px-4 py-3.5 text-sm text-muted-foreground">{v.vendor_code}</td>
                      <td className="px-4 py-3.5 text-sm text-muted-foreground">{v.cost}</td>
                      <td className="px-4 py-3.5 text-center">{v.price}</td>
                      <td className="px-4 py-3.5 text-center">
                        <span
                          className={`${v.stock < 20 ? 'text-amber-600' : 'text-green-600'
                            }`}
                        >
                          {v.stock}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden space-y-4">
            {vendor.vendor_products?.map((v) => (
              <div
                key={v.id}
                className="bg-card rounded-xl p-4 border border-border shadow-sm"
              >
                {/* Product Name */}
                <h3 className="text-center mb-3">{v.product_detail?.product_name}</h3>

                {/* Label-Value Pairs */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Vendor Code</span>
                    <span>{v.vendor_code}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Cost</span>
                    <span>{v.cost}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Price</span>
                    <span>{v.price}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Stock</span>
                    <span className={v.stock < 20 ? 'text-amber-600' : 'text-green-600'}>
                      {v.stock}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {vendor.vendor_products?.length === 0 && (
            <div className="bg-card rounded-xl p-12 text-center border border-border">
              <p className="text-muted-foreground">No products found.</p>
            </div>
          )}

        </div>


        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-5 border-t border-border">
          <button
            onClick={() => {
              setShowUpdateModal(true);
            }}
            className="flex-1 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
            Edit Vendor
          </button>
          <button className="flex-1 px-4 py-2.5 border border-border rounded-lg hover:bg-accent transition-colors">
            View All Returns
          </button>
        </div>
      </div>

      {/* Add Vendor Modal */}
      <AddEditVendorModal
        isOpen={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        onSave={handleUpdateVendor}
        isSaving={isUpdating}
        mode="edit"
        vendors={vendor}
      />
    </Modal>
  );
}
