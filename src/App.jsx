import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Tambahkan import CartProvider
import { CartProvider } from './context/CartContext'; 

// Import Komponen Layout & Global
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

// Import Halaman
import Home from './pages/Home';
import Auth from './pages/Auth'; // 🟢 Cukup satu Auth di sini
import LoginMitra from './pages/LoginMitra'; 
import Marketplace from './pages/Marketplace';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import JasaAgromarine from './pages/JasaAgromarine';
import PusatSewa from './pages/PusatSewa';
import DashboardMitra from './pages/DashboardMitra';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    // Bungkus seluruh aplikasi dengan CartProvider agar keranjang bisa "menyimpan" data
    <CartProvider>
      <Router>
        <div className="flex flex-col min-h-screen font-sans text-gray-800 bg-gray-50 overflow-x-hidden">

          <Navbar setIsSidebarOpen={setIsSidebarOpen} />

          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/jasa-agromarine" element={<JasaAgromarine />} />
              <Route path="/pusat-sewa" element={<PusatSewa />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              
              {/* Rute Autentikasi */}
              <Route path="/auth" element={<Auth />} />
              <Route path="/login" element={<Auth />} /> 
              <Route path="/login-mitra" element={<LoginMitra />} />

              {/* Rute Terlindungi Khusus Mitra */}
              <Route 
                path="/dashboard-mitra" 
                element={
                  <ProtectedRoute>
                    <DashboardMitra 
                      isSidebarOpen={isSidebarOpen} 
                      setIsSidebarOpen={setIsSidebarOpen} 
                    />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
