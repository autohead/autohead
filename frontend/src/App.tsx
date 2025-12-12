import { useState } from 'react';
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";

import DashboardPage from './pages/DashboardPage';
import VendorsPage from './pages/VendorsPage';
import ProductsPage from './pages/ProductsPage';
import BillingPage from './pages/BillingPage';
import SignInPage from './pages/SignInPage';
import {ProductReturnModal} from './components/products/ProductReturnModal';



export default function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleSignIn = (email: string, password: string) => {
    // Simple demo authentication - in production, validate against backend
    if (email && password) {
      setIsAuthenticated(true);
    }
  };

  const handleLogout = () => {
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
      case 'create-bill':
        setCurrentPage('billing');
        break;
      case 'product-return':
        setShowReturnModal(true);
        break;
      case 'update-stock':
        alert('Update Stock feature - Coming soon!');
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
        <Header onMenuToggle={toggleSidebar} currentPage={currentPage} onLogout={handleLogout}/>
        
        <main className="flex-1 overflow-y-auto">
          {renderPage()}
        </main>
      </div>

      {/* Global Product Return Modal */}
      <ProductReturnModal
        isOpen={showReturnModal}
        onClose={() => setShowReturnModal(false)}
        
      />
    </div>
  );
}