import { useState } from 'react';
import { Search, Plus, Edit, Eye } from 'lucide-react';
import { AddEditProductModal } from '../components/products/AddEditProductModal';
import { ProductDetailModal } from '../components/products/ProductsDetailsModal';
import { useProductData } from '../hooks/product';
import IsLoadingDisplay from '../components/common/IsLoadingDisplay';
import IsErrorDisplay from '../components/common/IsErrorDisplay';





export default function ProductsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [page, setPage] = useState(1);


    const {
        data, isLoading, isError,
    } = useProductData(page);


    const products = data?.products.results ?? [];
    const all_categories = data?.categories ?? [];
    const total_pages = data?.products.total_pages ?? 0;
    const current_page = data?.products.current_page ?? 0;

    if (isLoading) return <IsLoadingDisplay />;
    if (isError) return <IsErrorDisplay type='product' />;


    const filteredProducts = products.filter((product) => {
        const matchesSearch =
            product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.vendor_products?.some(vp =>
                vp.vendor_code.toLowerCase().includes(searchTerm.toLowerCase())
            );
        const matchesCategory = selectedCategory === 'all' || product.category_detail?.name === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const categories = ['all', ...Array.from(new Set(all_categories.map((p) => p.name)))];

    const handleAddProduct = (productData: any) => {
        console.log('New product:', productData);
        alert('Product added successfully!');
    };


    const handleViewProduct = (product: any) => {
        setSelectedProduct(product);
        setShowDetailModal(true);
    };

    return (
        <div className="p-4 lg:p-6">
            <div className="mb-6">
                {/* Header Actions */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search products by name or SKU..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                    </div>
                    <div className="flex gap-2">
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="px-4 py-2.5 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                        >
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat === 'all' ? 'All Categories' : cat}
                                </option>
                            ))}
                        </select>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 whitespace-nowrap"
                        >
                            <Plus className="w-5 h-5" />
                            <span className="hidden sm:inline">Add Product</span>
                        </button>
                    </div>
                </div>

                {/* Desktop Table View */}
                <div className="hidden lg:block bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm text-muted-foreground">Product Name</th>
                                    <th className="px-4 py-3 text-left text-sm text-muted-foreground">SKU</th>
                                    <th className="px-4 py-3 text-left text-sm text-muted-foreground">Category</th>
                                    <th className="px-4 py-3 text-left text-sm text-muted-foreground">Vendor</th>
                                    <th className="px-4 py-3 text-left text-sm text-muted-foreground">Stock Qty</th>
                                    <th className="px-4 py-3 text-left text-sm text-muted-foreground">Cost Price</th>
                                    <th className="px-4 py-3 text-left text-sm text-muted-foreground">Selling Price</th>
                                    <th className="px-4 py-3 text-left text-sm text-muted-foreground">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {filteredProducts.map((product) => (
                                    <tr key={product.id} className="hover:bg-accent/50 transition-colors">
                                        <td className="px-4 py-3.5">{product.product_name}</td>
                                        <td className="px-4 py-3.5 text-sm text-muted-foreground">
                                            {
                                                product.vendor_products?.length
                                                    ? product.vendor_products.map(vp => (
                                                        <div key={vp.id}>{vp.vendor_code} - {vp.vendor_detail?.name}</div>
                                                    ))
                                                    : '-'
                                            }
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-sm">
                                                {product.category_detail?.name}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3.5 text-sm">
                                            {product.vendor_products?.length
                                                ? product.vendor_products.map(vp => (
                                                    <div key={vp.id}>{vp.vendor_detail?.name}</div>
                                                ))
                                                : '-'}
                                        </td>
                                        <td className="px-4 py-3.5">
                                            {product.vendor_products?.length
                                                ? product.vendor_products.map((vp, index) => (
                                                    <span
                                                        key={index}
                                                        className={vp.stock < 20 ? 'text-amber-600' : 'text-green-600'}
                                                    >
                                                        {vp.stock}
                                                    </span>
                                                ))
                                                : '-'
                                            }
                                        </td>
                                        <td className="px-4 py-3.5 text-sm">{product.vendor_products?.length
                                            ? product.vendor_products.map((vp, index) => (
                                                <div key={index}>₹{vp.cost}</div>
                                            ))
                                            : 0}</td>
                                        <td className="px-4 py-3.5">
                                            {product.vendor_products?.length
                                                ? product.vendor_products.map((vp, index) => (
                                                    <div key={index}>₹{vp.price}</div>
                                                ))
                                                : 0}
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleViewProduct(product)}
                                                    className="p-2 hover:bg-accent rounded-lg transition-colors"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button className="p-2 hover:bg-accent rounded-lg transition-colors">
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Mobile Card View */}
                <div className="lg:hidden space-y-4">
                    {filteredProducts.map((product) => (
                        <div
                            key={product.id}
                            className="bg-card rounded-xl p-4 border border-border shadow-sm"
                        >
                            <div className="space-y-3">
                                <h3 className="text-foreground">{product.product_name}</h3>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div>
                                        <span className="text-muted-foreground">SKU:</span>
                                        <p className="mt-0.5">
                                            {
                                                product.vendor_products?.length
                                                    ? product.vendor_products.map(vp => (
                                                        <span key={vp.id}>{vp.vendor_code}</span>
                                                    ))
                                                    : '-'
                                            }
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Stock:</span>
                                        {product.vendor_products?.length
                                            ? product.vendor_products.map((vp, index) => (
                                                <p
                                                    key={index}
                                                    className={`mt-0.5 ${vp.stock < 20 ? 'text-amber-600' : 'text-green-600'
                                                        }`}
                                                >
                                                    {vp.stock} units
                                                </p>
                                            ))
                                            : '-'
                                        }

                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Category:</span>
                                        <p className="mt-0.5">
                                            <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs">
                                                {product.category_detail?.name}
                                            </span>
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Vendor:</span>
                                        <p className="mt-0.5">{
                                            product.vendor_products?.length
                                                ? product.vendor_products.map(vp => (
                                                    <span key={vp.id}>{vp.vendor_detail?.name}</span>
                                                ))
                                                : '-'
                                        }</p>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Cost:</span>
                                        <p className="mt-0.5">{
                                            product.vendor_products?.length
                                                ? product.vendor_products.map((vp, index) => (
                                                    <span key={index}>₹{vp.cost}</span>
                                                ))
                                                : 0
                                        }</p>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Selling:</span>
                                        <p className="mt-0.5">{product.vendor_products?.length
                                            ? product.vendor_products.map((vp, index) => (
                                                <span key={index}>₹{vp.price}</span>
                                            ))
                                            : 0}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2 pt-2">
                                    <button
                                        onClick={() => handleViewProduct(product)}
                                        className="flex-1 px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Eye className="w-4 h-4" />
                                        View
                                    </button>
                                    <button className="flex-1 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition-colors flex items-center justify-center gap-2">
                                        <Edit className="w-4 h-4" />
                                        Edit
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredProducts.length === 0 && (
                    <div className="bg-card rounded-xl p-12 text-center border border-border">
                        <p className="text-muted-foreground">No products found matching your criteria.</p>
                    </div>
                )}
            </div>

            {/* Floating Add Button (Mobile) */}
            <button
                onClick={() => setShowAddModal(true)}
                className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center hover:bg-primary/90 transition-all hover:scale-110"
            >
                <Plus className="w-6 h-6" />
            </button>


            <AddEditProductModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSave={handleAddProduct}
            />

            <ProductDetailModal
                isOpen={showDetailModal}
                onClose={() => setShowDetailModal(false)}
                product={selectedProduct}
            />

        </div>
    );
}