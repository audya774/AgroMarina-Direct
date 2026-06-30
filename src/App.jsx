import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import Komponen Layout & Global
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

// Import Halaman
import Home from './pages/Home';
import Auth from './pages/Auth';
import Marketplace from './pages/Marketplace';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import DashboardMitra from './pages/DashboardMitra';

function App() {
  // 1. Definisikan state untuk sidebar di sini
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <Router>
      <div className="flex flex-col min-h-screen font-sans text-gray-800 bg-gray-50">

        {/* 2. Kirim fungsi setter ke Navbar agar tombol bisa mengubah state ini */}
        <Navbar setIsSidebarOpen={setIsSidebarOpen} />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/auth" element={<Auth />} />

            {/* 3. Kirim state dan setter ke DashboardMitra melalui props */}
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
  );
}

export default App;
