import { useState } from 'react';
import { Modal } from '../Modal';
import { Package, User, AlertTriangle } from 'lucide-react';
import type { Product, ProductUpdateValues, Category } from '../../types/product';
import { useProductData } from '../../hooks/product';
import { AddEditProductModal } from './AddEditProductModal';
import { toast } from 'react-toastify';
import { getUserFriendlyError } from '../../utils/errorHelper';
import { useGetProductSalesAnalysisQuery } from '../../store/slices/productApiSlice';
import IsLoadingDisplay from '../common/IsLoadingDisplay';
import IsErrorDisplay from '../common/IsErrorDisplay';

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  categories?: Category[]
}

export function ProductDetailModal({ isOpen, onClose, product, categories }: ProductDetailModalProps) {

  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const { updateProduct, isUpdating } = useProductData(1);

  const productId = product?.id;

  const {
    data: analysisData,
    isLoading: isAnalysisLoading,
    isError: isAnalysisError,
  } = useGetProductSalesAnalysisQuery(
    { id: productId! },
    { skip: !productId || !isOpen }
  );

  if (!product) return null;


  const isLowStock = product.stock_count < 20;

  const vendorProduts = product.vendor_products;




  const handleUpdateProduct = async (updatedProduct: ProductUpdateValues) => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('product_name', updatedProduct.product_name);
      formDataToSend.append('product_code', updatedProduct.product_code);
      formDataToSend.append('category', String(updatedProduct.category));
      formDataToSend.append('description', updatedProduct.description ?? '');

      if (updatedProduct.image instanceof File) {
        formDataToSend.append('image', updatedProduct.image);
      }
      await updateProduct({
        id: product.id,
        product: formDataToSend
      }).unwrap();
      toast.success('Product updated successfully', { autoClose: 2000 });
      onClose();
    } catch (err: any) {
      const errorMessage = getUserFriendlyError(err, 'Failed to Update product. Please try again.');
      toast.error(errorMessage, { autoClose: 2000 });
      throw err;
    }
  };



  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Product Details" size="lg">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex items-start justify-between pb-5 border-b border-border">
          <div>
            <h3 className="text-foreground mb-1">{product.product_name}</h3>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span>SKU: {product.product_code}</span>
              <span>•</span>
              <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded">
                {product.category_detail?.name}
              </span>
            </div>
          </div>
          {isLowStock && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm">Low Stock</span>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Stock</p>
                <p className="text-blue-600">{product.stock_count} units</p>
              </div>
            </div>
          </div>


          {/* Min Stock */}
          <div className="bg-orange-50 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <User className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Min Stock</p>
                <p className="text-orange-600 text-sm truncate">20 units</p>
              </div>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="space-y-4">
          <h4>Product Information</h4>

          <div className="hidden lg:block bg-card rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm text-muted-foreground">Vendor Name</th>
                    <th className="px-4 py-3 text-left text-sm text-muted-foreground">Vendor Code</th>
                    <th className="px-4 py-3 text-left text-sm text-muted-foreground">Cost</th>
                    <th className="px-4 py-3 text-left text-sm text-muted-foreground">Price</th>
                    <th className="px-4 py-3 text-left text-sm text-muted-foreground">Stock</th>

                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {vendorProduts?.map((v) => (
                    <tr key={v.id} className="hover:bg-accent/50 transition-colors">
                      <td className="px-4 py-3.5">{v.vendor_detail?.name}</td>
                      <td className="px-4 py-3.5 text-sm text-muted-foreground">{v.vendor_code}</td>
                      <td className="px-4 py-3.5 text-sm text-muted-foreground">₹{v.cost}</td>
                      <td className="px-4 py-3.5 text-center">₹{v.price}</td>
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
            {vendorProduts?.map((v) => (
              <div
                key={v.id}
                className="bg-card rounded-xl p-4 border border-border shadow-sm"
              >
                {/* Product Name */}
                <h3 className="text-center mb-3">{v.vendor_detail?.name}</h3>

                {/* Label-Value Pairs */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Vendor Code</span>
                    <span>{v.vendor_code}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Cost</span>
                    <span>₹{v.cost}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Price</span>
                    <span>₹{v.price}</span>
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

          {vendorProduts?.length === 0 && (
            <div className="bg-card rounded-xl p-12 text-center border border-border">
              <p className="text-muted-foreground">No Details found.</p>
            </div>
          )}


        </div>


        {isAnalysisLoading && (
          <IsLoadingDisplay />
        )}

        {isAnalysisError ? (
          <div className="pt-5 border-t border-border">
            <IsErrorDisplay type="Sales Analysis" />
          </div>
        ) : (

          // Sales Analysis Section
          <div className="pt-5 border-t border-border">
            <h4 className="mb-4">Sales Analytics</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-accent/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Total Sales</p>
                <p>{analysisData?.total_sales}</p>
              </div>
              <div className="text-center p-4 bg-accent/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">This Month</p>
                <p>{analysisData?.this_month_sales}</p>
              </div>
              <div className="text-center p-4 bg-accent/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Revenue</p>
                <p>₹{analysisData?.total_revenue}</p>
              </div>
              <div className="text-center p-4 bg-accent/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Last Sold 2 Days</p>
                <p className="text-sm">{analysisData?.last_2day_sales}</p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-5 border-t border-border">
          <button
            onClick={() => {
              setShowUpdateModal(true);
            }}
            className="flex-1 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
            Edit Product
          </button>
        </div>
      </div>


      <AddEditProductModal
        isOpen={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        products={product}
        isSaving={isUpdating}
        mode='edit'
        onSave={handleUpdateProduct}
        categories={categories}
      />
    </Modal>
  );
}
