import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainApp from "./mainApp";
import InvoicePage from "./pages/InvoicePage";
import SignInPage from './pages/SignInPage';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("adminToken")
  );


  useEffect(() => {
    // Auto-login if token exists
    const token = localStorage.getItem("adminToken");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);


   const handleLogout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
  };

  const handleSignIn = () => setIsAuthenticated(true);



  return (
    <Router>
      <Routes>
        {/* PUBLIC ROUTE */}
        <Route path="/invoice/:id" element={<InvoicePage />} />

        {/* PROTECTED ROUTES */}
        <Route
          path="/*"
          element={
            isAuthenticated ? <MainApp onLogout={handleLogout} /> : <SignInPage onSignIn={handleSignIn} />
          }
        />
      </Routes>
    </Router>
  );
}