import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleMitraPanelClick = () => {
    setIsMenuOpen(false); // Tutup dropdown menu
    
    // Cek apakah sudah di halaman dashboard
    if (window.location.pathname === '/dashboard-mitra') {
      // Kirim sinyal buka ke DashboardMitra
      window.dispatchEvent(new Event('bukaSidebar'));
    } else {
      // Jika di halaman lain, pindah ke dashboard
      navigate('/dashboard-mitra');
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

          <Link to="/" className="text-xl md:text-2xl font-black text-emerald-600 tracking-tight">
            Agro<span className="text-slate-800">Marina</span>
          </Link>
        </div>

        {/* KANAN: Tombol Login */}
        <Link to="/auth" className="bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-emerald-600">
          Masuk / Daftar
        </Link>
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
            
            {/* Tombol MitraPanel yang sudah diedit */}
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
