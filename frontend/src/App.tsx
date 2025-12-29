import { useState, useEffect } from 'react';
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";

import DashboardPage from './pages/DashboardPage';
import VendorsPage from './pages/VendorsPage';
import ProductsPage from './pages/ProductsPage';
import BillingPage from './pages/BillingPage';
import SignInPage from './pages/SignInPage';
import CategoryPage from './pages/CategoryPage';
import { ProductReturnModal } from './components/inventory/ProductReturnModal';
import { AddEditVendorProduct } from './components/vendorProduct/AddEditVendorProduct';
import { ProductStockAdjustmentModal } from './components/inventory/ProductStockAdjustmentModal';


import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



export default function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("adminToken")
  );

  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);
  const [showAddVendorProductModal, setShowAddVendorProductModal] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    // Auto-login if token exists
    const token = localStorage.getItem("adminToken");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleSignIn = () => setIsAuthenticated(true);
  
  const handleLogout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    setCurrentPage('dashboard');
  };




  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'add-product':
        setCurrentPage('products');
        // The Products page will handle showing the add modal
        break;
      case 'add-vendor':
        setCurrentPage('vendors');
        // The Vendors page will handle showing the add modal
        break;
      case 'add-vendor-product':
        setShowAddVendorProductModal(true);
        // The Products page will handle showing the add modal
        break;
      case 'create-bill':
        setCurrentPage('billing');
        break;
      case 'product-return':
        setShowReturnModal(true);
        break;
      case 'update-stock':
        setShowStockModal(true);
        break;

      case 'logout':
        alert('Logout feature - Coming soon!');
        break;
      default:
        break;
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'products':
        return <ProductsPage />;
      case 'vendors':
        return <VendorsPage />;
      case 'billing':
        return <BillingPage />;
      case 'categories':
        return <CategoryPage />;
      default:
        return <DashboardPage />;
    }
  };


  // Show Sign In page if not authenticated
  if (!isAuthenticated) {
    return <SignInPage onSignIn={handleSignIn} />;
  }


  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        isOpen={sidebarOpen}
        onToggle={toggleSidebar}
        onQuickAction={handleQuickAction}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuToggle={toggleSidebar} currentPage={currentPage} onLogout={handleLogout} />

        <main className="flex-1 overflow-y-auto">
          {renderPage()}
        </main>

        <ToastContainer position="top-center"/>
      </div>

      {/* Global Product Return Modal */}
      <ProductReturnModal
        isOpen={showReturnModal}
        onClose={() => setShowReturnModal(false)}

      />

      {/* Global Add/Edit Vendor Product Modal */}
      <AddEditVendorProduct
        isOpen={showAddVendorProductModal}
        onClose={() => setShowAddVendorProductModal(false)}
        mode="add"
        onSave={() => {}}
        isSaving={false}
      />

      {/* Global Product Stock Adjustment Modal */}
      <ProductStockAdjustmentModal
        isOpen={showStockModal}
        onClose={() => setShowStockModal(false)}

      />
    </div>
  );
}