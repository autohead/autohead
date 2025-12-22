import { useState } from 'react';
import { Modal } from '../Modal';
import { Package, DollarSign, TrendingUp, MapPin, Barcode, User, AlertTriangle } from 'lucide-react';
import type { Product, ProductUpdateValues, Category } from '../../types/product';
import { useProductData } from '../../hooks/product';
import { AddEditProductModal } from './AddEditProductModal';
import { toast } from 'react-toastify';
import { getUserFriendlyError } from '../../utils/errorHelper';

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  categories?: Category[]
}

export function ProductDetailModal({ isOpen, onClose, product, categories }: ProductDetailModalProps) {

  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const { updateProduct, isUpdating } = useProductData(1);

  if (!product) return null;

  const sellingPrice = 10;
  const costPrice = 5;
  const profit = sellingPrice - costPrice;
  const profitMargin = ((profit / sellingPrice) * 100).toFixed(1);
  const isLowStock = product.stock_count < 20;


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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

          <div className="bg-green-50 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Selling Price</p>
                <p className="text-green-600">₹{sellingPrice}</p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Profit Margin</p>
                <p className="text-purple-600">{profitMargin}%</p>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <User className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Vendor</p>
                <p className="text-orange-600 text-sm truncate">v</p>
              </div>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="space-y-4">
          <h4>Product Information</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Cost Price */}
            <div className="bg-accent/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">Cost Price</p>
              <p>₹{costPrice}</p>
            </div>

            {/* Profit per Unit */}
            <div className="bg-accent/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">Profit per Unit</p>
              <p className="text-green-600">₹{profit}</p>
            </div>

            {/* Minimum Stock */}

            <div className="bg-accent/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">Minimum Stock Level</p>
              <p>20 units</p>
            </div>


            {/* Barcode */}

            <div className="bg-accent/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <Barcode className="w-4 h-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Barcode</p>
              </div>
              <p>BarCode</p>
            </div>


            {/* Storage Location */}

            <div className="bg-accent/50 rounded-lg p-4 md:col-span-2">
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Storage Location</p>
              </div>
              <p>Location</p>
            </div>

          </div>

          {/* Description */}
          {product.description && (
            <div className="bg-accent/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-2">Description</p>
              <p className="text-sm leading-relaxed">{product.description}</p>
            </div>
          )}
        </div>

        {/* Sales Analytics */}
        <div className="pt-5 border-t border-border">
          <h4 className="mb-4">Sales Analytics</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-accent/50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Total Sales</p>
              <p>234</p>
            </div>
            <div className="text-center p-4 bg-accent/50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">This Month</p>
              <p>42</p>
            </div>
            <div className="text-center p-4 bg-accent/50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Revenue</p>
              <p>₹{(sellingPrice * 234).toFixed(2)}</p>
            </div>
            <div className="text-center p-4 bg-accent/50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Last Sold</p>
              <p className="text-sm">2 days ago</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-5 border-t border-border">
          <button
            onClick={() => {
              setShowUpdateModal(true);
            }}
            className="flex-1 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
            Edit Product
          </button>
          <button className="flex-1 px-4 py-2.5 border border-border rounded-lg hover:bg-accent transition-colors">
            Update Stock
          </button>
          <button className="flex-1 px-4 py-2.5 border border-destructive text-destructive rounded-lg hover:bg-destructive/10 transition-colors">
            Delete Product
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
