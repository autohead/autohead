import {
    LayoutDashboard,
    Package,
    Users,
    FileText,
    Menu,
    X,
    Plus,
    RefreshCw,
    Undo2,
    LayoutGrid,
} from 'lucide-react';


interface SidebarProps {
    currentPage: string;
    onNavigate: (page: string) => void;
    isOpen: boolean;
    onToggle: () => void;
    onQuickAction?: (action: string) => void;
}


export function Sidebar({ currentPage, onNavigate, isOpen, onToggle, onQuickAction }: SidebarProps) {

    const mainNavItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'categories', label: 'Categories', icon: LayoutGrid },
        { id: 'products', label: 'Products', icon: Package },
        { id: 'vendors', label: 'Vendors', icon: Users },
        { id: 'billing', label: 'Billing', icon: FileText },
    ];


    const quickActions = [
        { id: 'add-product', label: 'Add Product', icon: Plus },
        { id: 'add-vendor', label: 'Add Vendor', icon: Plus },
        { id: 'add-vendor-product', label: 'Add Vendor Product', icon: Plus },
        { id: 'create-bill', label: 'Create Bill', icon: FileText },
        { id: 'update-stock', label: 'Update Stock', icon: RefreshCw },
        { id: 'product-return', label: 'Product Return', icon: Undo2 },

        { id: 'logout', label: 'Logout', icon: Menu },
    ];



    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={onToggle}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
          fixed top-0 left-0 h-full bg-sidebar text-sidebar-foreground
          transition-transform duration-300 ease-in-out z-50
          w-64 border-r border-sidebar-border
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-auto
        `}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
                        <h2 className="text-sidebar-primary-foreground">Auto Head</h2>
                        <button
                            onClick={onToggle}
                            className="lg:hidden p-2 hover:bg-sidebar-accent rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto p-4">
                        <div className="space-y-1">
                            {mainNavItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = currentPage === item.id;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => {
                                            onNavigate(item.id);
                                            if (window.innerWidth < 1024) onToggle();
                                        }}
                                        className={`
                      w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                      transition-colors duration-200
                      ${isActive
                                                ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                                                : 'hover:bg-sidebar-accent text-sidebar-foreground'
                                            }
                    `}
                                    >
                                        <Icon className="w-5 h-5 flex-shrink-0" />
                                        <span>{item.label}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Quick Actions */}
                        <div className="mt-8">
                            <h3 className="px-3 mb-2 text-sm text-sidebar-foreground/60">Quick Actions</h3>
                            <div className="space-y-1">
                                {quickActions.map((action) => {
                                    const Icon = action.icon;
                                    return (
                                        <button
                                            key={action.id}
                                            onClick={() => {
                                                if (onQuickAction) {
                                                    onQuickAction(action.id);
                                                }
                                                if (window.innerWidth < 1024) onToggle();
                                            }}
                                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground transition-colors duration-200"
                                        >
                                            <Icon className="w-4 h-4 flex-shrink-0" />
                                            <span className="text-sm">{action.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </nav>

                    {/* Footer */}
                    <div className="p-4 border-t border-sidebar-border">
                        <div className="px-3 py-2">
                            <p className="text-sm text-sidebar-foreground/60">Admin Panel v1.0</p>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );


}