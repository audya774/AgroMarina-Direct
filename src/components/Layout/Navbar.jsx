import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabase'; 

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  // 🟢 FUNGSI KLIK KERANJANG DI NAVBAR
  const handleCartClick = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      alert('Silakan login atau daftar akun terlebih dahulu untuk melihat keranjang.');
      navigate('/login');
    } else {
      navigate('/cart');
    }
  };

  // 🟢 FUNGSI KLIK MITRAPANEL (Gabungan Buka Sidebar & Cek Role)
  const handleMitraPanelClick = async () => {
    setIsMenuOpen(false); // Tutup dropdown menu
    
    // Cek sesi login
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      // Jika belum login, ke halaman daftar mitra
      navigate('/login-mitra');
    } else {
      // Jika sudah login, cek role di database
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (profile?.role === 'mitra' || profile?.role === 'admin') {
        // Jika sudah mitra, buka dashboard
        if (window.location.pathname === '/dashboard-mitra') {
          window.dispatchEvent(new Event('bukaSidebar'));
        } else {
          navigate('/dashboard-mitra');
        }
      } else {
        // Jika pembeli biasa, ke halaman daftar mitra
        navigate('/login-mitra');
      }
    }
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 relative">
      <div className="p-4 max-w-7xl mx-auto flex justify-between items-center">
        
        {/* KIRI: Tombol Baris 3 & Logo */}
        <div className="flex items-center gap-3 md:gap-4">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors focus:outline-none"
          >
            {isMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
          <Link to="/" className="flex items-center -ml-5">
            <img 
              src="/icon.png" 
              alt="Logo AgroMarina" 
              className="h-[60px] w-auto object-contain" 
            />
          </Link>
        </div>

        {/* KANAN: Tombol Keranjang & Login */}
        <div className="flex items-center gap-3">
          {/* Tombol Keranjang Navbar */}
          <button 
            onClick={handleCartClick}
            className="p-2 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors"
            title="Lihat Keranjang"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </button>

          <Link to="/auth" className="bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-emerald-600">
            Masuk
          </Link>
        </div>
      </div>

      {/* DROPDOWN MENU BERSIH */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 w-64 md:w-72 bg-white shadow-xl border-t border-emerald-100 flex flex-col rounded-br-3xl animate-fade-in overflow-hidden z-40">
          <div className="p-6 flex flex-col gap-5">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">
              Menu Utama
            </h3>
            
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-slate-700 hover:text-emerald-600 hover:pl-2 font-semibold transition-all">
              Beranda
            </Link>
            
            <Link to="/marketplace" onClick={() => setIsMenuOpen(false)} className="text-slate-700 hover:text-emerald-600 hover:pl-2 font-semibold transition-all">
              Pasar Digital
            </Link>
            
            <Link to="/jasa-agromarine" onClick={() => setIsMenuOpen(false)} className="text-slate-700 hover:text-emerald-600 hover:pl-2 font-semibold transition-all">
              Jasa Agromarine
            </Link>
            
            <Link to="/pusat-sewa" onClick={() => setIsMenuOpen(false)} className="text-slate-700 hover:text-emerald-600 hover:pl-2 font-semibold transition-all">
              Pusat Sewa
            </Link>           
            
            {/* Tombol MitraPanel */}
            <button 
              onClick={handleMitraPanelClick}
              className="text-slate-700 hover:text-emerald-600 hover:pl-2 font-semibold transition-all text-left"
            >
              MitraPanel (Dashboard)
            </button>
            
            <div className="h-px bg-slate-100 my-2"></div>
            
            <span className="text-slate-400 font-semibold cursor-not-allowed text-sm">
              Kebijakan Privasi
            </span>
          </div>
        </div>
      )}
    </nav>
  );
}
