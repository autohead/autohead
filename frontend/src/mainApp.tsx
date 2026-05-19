import { useState } from 'react';
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import DashboardPage from './pages/DashboardPage';
import VendorsPage from './pages/VendorsPage';
import ProductsPage from './pages/ProductsPage';
import BillingPage from './pages/BillingPage';
import BillRecords from './pages/BillRecords';
import Analytics from './pages/Analytics';
import TransactionsPage from './pages/TranasactionsPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';



export default function MainApp({ onLogout }: { onLogout: () => void }) {

    const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // const [showStockModal, setShowStockModal] = useState(false);
  // const [showAddVendorProductModal, setShowAddVendorProductModal] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);



const handleLogoutClick = () => {
    onLogout();        // update auth state in App
    navigate("/");     // redirect after logout
  };



  const handleQuickAction = (action: string) => {
    switch (action) {
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
      case 'billRecords':
        return <BillRecords />;
      case 'transactions':
        return <TransactionsPage />;
      case 'analytics':
        return <Analytics />;
      default:
        return <DashboardPage />;
    }
  };


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
        <Header onMenuToggle={toggleSidebar} currentPage={currentPage} onLogout={handleLogoutClick} />

        <main className="flex-1 overflow-y-auto">
          {renderPage()}
        </main>

        <ToastContainer position="top-center"/>
      </div>

    </div>
  );
}