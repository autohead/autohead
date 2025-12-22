import { Modal } from '../Modal';
import { Package, DollarSign, TrendingUp, MapPin, Barcode, User, Calendar, AlertTriangle } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  sku: string;
  category: string;
  vendor: string;
  stock: number;
  costPrice: number;
  sellingPrice: number;
  description?: string;
  barcode?: string;
  location?: string;
  minStock?: number;
}

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

export function Temp({ isOpen, onClose, product }: ProductDetailModalProps) {
  if (!product) return null;

  const profit = product.sellingPrice - product.costPrice;
  const profitMargin = ((profit / product.sellingPrice) * 100).toFixed(1);
  const isLowStock = product.stock < (product.minStock || 20);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Product Details" size="lg">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex items-start justify-between pb-5 border-b border-border">
          <div>
            <h3 className="text-foreground mb-1">{product.name}</h3>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span>SKU: {product.sku}</span>
              <span>•</span>
              <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded">
                {product.category}
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
                <p className="text-blue-600">{product.stock} units</p>
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
                <p className="text-green-600">₹{product.sellingPrice.toLocaleString()}</p>
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
                <p className="text-orange-600 text-sm truncate">{product.vendor}</p>
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
              <p>₹{product.costPrice.toLocaleString()}</p>
            </div>

            {/* Profit per Unit */}
            <div className="bg-accent/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">Profit per Unit</p>
              <p className="text-green-600">₹{profit.toLocaleString()}</p>
            </div>

            {/* Minimum Stock */}
            {product.minStock && (
              <div className="bg-accent/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">Minimum Stock Level</p>
                <p>{product.minStock} units</p>
              </div>
            )}

            {/* Barcode */}
            {product.barcode && (
              <div className="bg-accent/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Barcode className="w-4 h-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Barcode</p>
                </div>
                <p>{product.barcode}</p>
              </div>
            )}

            {/* Storage Location */}
            {product.location && (
              <div className="bg-accent/50 rounded-lg p-4 md:col-span-2">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Storage Location</p>
                </div>
                <p>{product.location}</p>
              </div>
            )}
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
              <p>₹{(product.sellingPrice * 234).toLocaleString()}</p>
            </div>
            <div className="text-center p-4 bg-accent/50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Last Sold</p>
              <p className="text-sm">2 days ago</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-5 border-t border-border">
          <button className="flex-1 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
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
    </Modal>
  );
}
