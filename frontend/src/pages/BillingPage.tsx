import { useMemo, useState } from 'react';
import { Search, Plus, Minus, Trash2, ShoppingCart, DollarSign, Eye } from 'lucide-react';
import { useDropDownData } from '../hooks/dropDown';
import type { DropDownListData } from '../types/dropDown';

interface CartItem {
    id: number;
    productId: number;
    name: string;
    sku: string;
    price: number;
    quantity: number;
}


const availableProducts = [
    { id: 1, name: 'Premium Floor Mats', sku: 'ACC-001', price: 1200, stock: 45 },
    { id: 2, name: 'LED Headlight Kit', sku: 'ACC-045', price: 3500, stock: 23 },
    { id: 3, name: 'Car Cover Waterproof', sku: 'ACC-089', price: 1800, stock: 18 },
    { id: 4, name: 'Phone Mount Magnetic', sku: 'ACC-112', price: 750, stock: 67 },
    { id: 5, name: 'Dash Camera HD', sku: 'ACC-156', price: 4500, stock: 31 },
    { id: 6, name: 'Seat Covers Leather', sku: 'ACC-201', price: 6500, stock: 12 },
    { id: 7, name: 'Tire Pressure Monitor', sku: 'ACC-267', price: 2500, stock: 54 },
    { id: 8, name: 'Steering Wheel Cover', sku: 'ACC-298', price: 550, stock: 89 },
];

const billHistory = [
    { id: '#1234', date: '2024-12-10', customer: 'John Doe', amount: 5420, items: 3 },
    { id: '#1233', date: '2024-12-10', customer: 'Sarah Smith', amount: 3890, items: 2 },
    { id: '#1232', date: '2024-12-09', customer: 'Mike Johnson', amount: 12300, items: 5 },
    { id: '#1231', date: '2024-12-09', customer: 'Emily Davis', amount: 2100, items: 1 },
    { id: '#1230', date: '2024-12-08', customer: 'Robert Brown', amount: 8750, items: 4 },
];

export default function BillingPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [cart, setCart] = useState<CartItem[]>([]);
    const [discount, setDiscount] = useState(0);
    const [customerName, setCustomerName] = useState('');
    const { data, isLoading, refetch: dropDownRefetch, } = useDropDownData();

    const products: DropDownListData['products'] = data?.products || [];
    const vendorProducts: DropDownListData['vendor_products'] = data?.vendor_products || [];


    // Get products by ID
    const productsById = useMemo(() => {
        return (products || []).reduce((acc: Record<number, typeof products[0]>, product) => {
            acc[product.id] = product;
            return acc;
        }, {});
    }, [data]);

    // Map vendor products to include stock info
    const productsWithStock = useMemo(() => {
        return (vendorProducts || []).map((vp) => ({
            id: vp.id,
            product_name: productsById[vp.product]?.product_name,
            stock: vp.stock,
            price:vp.price,
        }));
    }, [vendorProducts, productsById]);

    // Filter products based on search term
    const filteredProducts = useMemo(() => {
        return productsWithStock.filter(
            (product) =>
                product.product_name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm]);


    const addToCart = (product: typeof productsWithStock[0]) => {
        const existingItem = cart.find((item) => item.productId === product.id);
        const availableStock = product.stock;

        // Check stock before adding
        if (existingItem && existingItem.quantity >= availableStock || (!existingItem && availableStock <= 0)) {
            alert('Cannot add more items than available in stock.');
            return;
        }
        
        if (existingItem) {
            setCart(
                cart.map((item) =>
                    item.productId === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            );
        } else {
            setCart([
                ...cart,
                {
                    id: Date.now(),
                    productId: product.id,
                    name: product.product_name,
                    sku: "suku",
                    price: product.price,
                    quantity: 1,
                },
            ]);
        }
    };


    const updateQuantity = (itemId: number, delta: number) => {
        setCart(
            cart
                .map((item) =>
                    item.id === itemId
                        ? { ...item, quantity: Math.max(0, item.quantity + delta) }
                        : item
                )
                .filter((item) => item.quantity > 0)
        );
    };

    const removeFromCart = (itemId: number) => {
        setCart(cart.filter((item) => item.id !== itemId));
    };

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discountAmount = (subtotal * discount) / 100;
    const total = subtotal - discountAmount;

    const handleGenerateBill = () => {
        if (cart.length === 0) {
            alert('Cart is empty!');
            return;
        }
        alert(`Bill generated successfully!\nTotal: ₹${total.toLocaleString()}`);
        setCart([]);
        setDiscount(0);
        setCustomerName('');
        setSearchTerm('');
    };



    return (
        <div className="p-4 lg:p-6">
            {/* Desktop: Two-column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Left Column: Product Search & Cart */}
                <div className="lg:col-span-3 space-y-4">
                    {/* Product Search */}
                    <div className="bg-card rounded-xl p-4 lg:p-5 border border-border shadow-sm">
                        <h3 className="mb-4">Search Products</h3>
                        <div className="relative mb-4">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search by product name or SKU..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                        </div>

                        {/* Product List */}
                        <div className="max-h-64 overflow-y-auto space-y-2">
                            {filteredProducts.map((product) => (
                                <div
                                    key={product.id}
                                    onClick={() => addToCart(product)}
                                    className="flex items-center justify-between p-3 hover:bg-accent rounded-lg cursor-pointer transition-colors"
                                >
                                    <div className="flex-1">
                                        <p>{product.product_name}</p>
                                        <p className="text-sm text-muted-foreground">suk • Stock: {product.stock}</p>
                                    </div>
                                    <div className="text-right">
                                        <p>₹{product.price}</p>
                                        <Plus className="w-4 h-4 ml-auto text-primary" />
                                    </div>
                                </div>
                            ))}
                            {filteredProducts.length === 0 && (
                                <p className="text-center text-muted-foreground py-8">No products found</p>
                            )}
                        </div>
                    </div>

                    {/* Cart */}
                    <div className="bg-card rounded-xl p-4 lg:p-5 border border-border shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <ShoppingCart className="w-5 h-5" />
                            <h3>Cart ({cart.length} items)</h3>
                        </div>

                        {cart.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground">
                                <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                <p>Cart is empty</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {cart.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center gap-3 p-3 bg-accent/50 rounded-lg"
                                    >
                                        <div className="flex-1 min-w-0">
                                            <p className="truncate">{item.name}</p>
                                            <p className="text-sm text-muted-foreground">{item.sku}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => updateQuantity(item.id, -1)}
                                                className="p-1.5 hover:bg-background rounded transition-colors"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="w-8 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, 1)}
                                                className="p-1.5 hover:bg-background rounded transition-colors"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div className="text-right min-w-20">
                                            <p>₹{(item.price * item.quantity).toLocaleString()}</p>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="p-1.5 hover:bg-destructive/10 text-destructive rounded transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Payment Summary */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="bg-card rounded-xl p-4 lg:p-5 border border-border shadow-sm sticky top-24">
                        <h3 className="mb-4">Payment Summary</h3>

                        <div className="space-y-3 mb-4">
                            <div>
                                <label className="block text-sm text-muted-foreground mb-1.5">Customer Name</label>
                                <input
                                    type="text"
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                    placeholder="Enter customer name"
                                    className="w-full px-3 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-muted-foreground mb-1.5">Discount (%)</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={discount}
                                    onChange={(e) => setDiscount(Math.min(100, Math.max(0, Number(e.target.value))))}
                                    className="w-full px-3 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                        </div>

                        <div className="border-t border-border pt-4 space-y-2.5">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span>₹{subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Discount ({discount}%)</span>
                                <span className="text-destructive">- ₹{discountAmount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between pt-2 border-t border-border">
                                <span>Total</span>
                                <span className="text-primary">₹{total.toLocaleString()}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleGenerateBill}
                            disabled={cart.length === 0}
                            className="w-full mt-6 px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            <DollarSign className="w-5 h-5" />
                            Generate Bill
                        </button>
                    </div>
                </div>
            </div>

            {/* Bill History */}
            <div className="mt-6 bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                <div className="p-5 border-b border-border">
                    <h3>Recent Bills</h3>
                </div>

                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm text-muted-foreground">Bill ID</th>
                                <th className="px-4 py-3 text-left text-sm text-muted-foreground">Date</th>
                                <th className="px-4 py-3 text-left text-sm text-muted-foreground">Customer</th>
                                <th className="px-4 py-3 text-left text-sm text-muted-foreground">Items</th>
                                <th className="px-4 py-3 text-left text-sm text-muted-foreground">Amount</th>
                                <th className="px-4 py-3 text-left text-sm text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {billHistory.map((bill) => (
                                <tr key={bill.id} className="hover:bg-accent/50 transition-colors">
                                    <td className="px-4 py-3.5">{bill.id}</td>
                                    <td className="px-4 py-3.5 text-sm text-muted-foreground">{bill.date}</td>
                                    <td className="px-4 py-3.5">{bill.customer}</td>
                                    <td className="px-4 py-3.5 text-center">{bill.items}</td>
                                    <td className="px-4 py-3.5">₹{bill.amount.toLocaleString()}</td>
                                    <td className="px-4 py-3.5">
                                        <button className="p-2 hover:bg-accent rounded-lg transition-colors">
                                            <Eye className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Cards */}

            </div>
        </div>
    )
}