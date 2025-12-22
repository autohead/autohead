import { useState } from 'react';
import { Search, Plus, Edit, Eye } from 'lucide-react';
import { AddEditProductModal } from '../components/products/AddEditProductModal';
import { ProductDetailModal } from '../components/products/ProductsDetailsModal';
import { useProductData } from '../hooks/product';
import type { Product, ProductFormValues } from '../types/product';
import Pagination from '../components/common/Pagination';
import IsLoadingDisplay from '../components/common/IsLoadingDisplay';
import IsErrorDisplay from '../components/common/IsErrorDisplay';
import ImagePreviewDialoge from '../components/common/ImagePreviewDialoge';
import { toast } from 'react-toastify';
import { getUserFriendlyError } from '../utils/errorHelper';





export default function ProductsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [showImageModal, setShowImageModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState<any>('');
    const [page, setPage] = useState(1);


    const {
        data, isLoading, isError,
        createProduct, isCreating,
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

    const handleAddProduct = async (productData: ProductFormValues) => {
        try {
            const formDataToSend = new FormData();

            formDataToSend.append('product_name', productData.product_name);
            formDataToSend.append('product_code', productData.product_code);
            formDataToSend.append('category', String(productData.category));
            formDataToSend.append('description', productData.description ?? '');

            if (productData.image) {
                formDataToSend.append('image', productData.image);
            }

            // console.log(productData.image);

            await createProduct(formDataToSend).unwrap();
            toast.success('Product added successfully', { autoClose: 2000 });
        } catch (err: any) {
            const errorMessage = getUserFriendlyError(err, 'Failed to add product. Please try again.');
            toast.error(errorMessage, { autoClose: 2000 });
            throw err;
        }
    };


    const handleViewProduct = (product: Product) => {
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
                                    <th className="px-4 py-3 text-left text-sm text-muted-foreground">Product Code</th>
                                    <th className="px-4 py-3 text-left text-sm text-muted-foreground">Category</th>
                                    {/* <th className="px-4 py-3 text-left text-sm text-muted-foreground">Vendor</th> */}
                                    <th className="px-4 py-3 text-left text-sm text-muted-foreground">Stock Qty</th>
                                    {/* <th className="px-4 py-3 text-left text-sm text-muted-foreground">Cost Price</th>
                                    <th className="px-4 py-3 text-left text-sm text-muted-foreground">Selling Price</th> */}
                                    <th className="px-4 py-3 text-left text-sm text-muted-foreground">Image</th>
                                    <th className="px-4 py-3 text-left text-sm text-muted-foreground">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {filteredProducts.map((product) => (
                                    <tr key={product.id} className="hover:bg-accent/50 transition-colors">
                                        <td className="px-4 py-3.5">{product.product_name}</td>
                                        <td className="px-4 py-3.5 text-sm text-muted-foreground">
                                            {
                                                product.product_code
                                            }
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-sm">
                                                {product.category_detail?.name}
                                            </span>
                                        </td>

                                        <td className="px-4 py-3.5">
                                            <span

                                                className={product.stock_count < 20 ? 'text-amber-600' : 'text-green-600'}
                                            >
                                                {product.stock_count} Nos
                                            </span>
                                        </td>

                                        <td className="px-4 py-3.5">
                                            {product.image ? (
                                                <img
                                                    src={product.image_url}
                                                    alt={product.product_name}
                                                    className={`w-12 h-12 object-cover rounded-lg ${product.image ? 'cursor-pointer' : ''}`}
                                                    onClick={
                                                        () => {
                                                            setSelectedImage(product.image_url);
                                                            setShowImageModal(true);
                                                            setSelectedProduct(product);
                                                        }
                                                    }
                                                />
                                            ) : (
                                                <span className="text-muted-foreground">No Image</span>
                                            )}
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
                                        <span className="text-muted-foreground">Product Code:</span>
                                        <p className="mt-0.5">
                                            {product.product_code}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Stock:</span>

                                        <p

                                            className={`mt-0.5 ${product.stock_count < 20 ? 'text-amber-600' : 'text-green-600'
                                                }`}
                                        >
                                            {product.stock_count} units
                                        </p>


                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Category:</span>
                                        <p className="mt-0.5">
                                            <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs">
                                                {product.category_detail?.name}
                                            </span>
                                        </p>
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


            {/* Pagination */}
            <Pagination
                currentPage={current_page}
                totalPages={total_pages}
                onPageChange={setPage}
                onShowLess={() => setPage(1)} // ✅ reset to first page
                isLoading={isLoading && page > 1}
            />

            <AddEditProductModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSave={handleAddProduct}
                categories={all_categories}
                mode="add"
                isSaving={isCreating}
            />

            <ProductDetailModal
                isOpen={showDetailModal}
                onClose={() => setShowDetailModal(false)}
                product={selectedProduct}
                categories={all_categories}
            />

            <ImagePreviewDialoge
                isOpen={showImageModal}
                onCancel={() => setShowImageModal(false)}
                image={selectedImage}
                product={selectedProduct}
            />

        </div>
    );
}