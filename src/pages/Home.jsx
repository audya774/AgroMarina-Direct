import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, ShieldCheck, Truck, ArrowRight, Anchor, Leaf } from 'lucide-react';
import MarketTicker from '../components/marketplace/MarketTicker';

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <MarketTicker />

      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 py-20 lg:py-32 overflow-hidden border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200 mb-8">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Platform Rantai Pasok Terbuka</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-tight mb-6">
              Dari Pesisir & Ladang, <br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-600">
                Langsung ke Tangan Anda.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-500 mb-10 max-w-2xl mx-auto">
              AgroMarina Direct memotong jalur distribusi panjang. Kami menghubungkan nelayan dan petani langsung dengan harga yang adil.
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/marketplace" className="w-full sm:w-auto bg-slate-900 text-white font-bold py-4 px-8 rounded-2xl shadow-xl flex items-center justify-center space-x-2">
                <span>Mulai Belanja</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/dashboard-mitra" className="w-full sm:w-auto bg-white text-slate-700 font-bold py-4 px-8 rounded-2xl shadow-sm border border-slate-200 text-center">
                Masuk sebagai Mitra
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* KATEGORI PREVIEW */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-black mb-12 tracking-tight">Jelajahi Sektor Kami</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">

            {/* KARTU AGRO */}
            <Link to="/marketplace?category=agro" className="group relative rounded-3xl overflow-hidden aspect-[4/3] sm:aspect-[16/9] flex items-center justify-center border border-slate-700 hover:border-emerald-500 transition-colors">
              <div className="absolute inset-0 bg-slate-900/60 group-hover:bg-slate-900/40 transition-colors z-10"></div>
              <img 
                src="/bg-agro.png" 
                alt="Agro" 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
              />
              <div className="relative z-20 text-center">
                <Leaf className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
                <h3 className="text-3xl font-black tracking-widest uppercase">Agro</h3>
                <p className="text-emerald-100 mt-2 text-sm font-medium">Pertanian & Perkebunan</p>
              </div>
            </Link>

            {/* KARTU MARINE */}
            <Link to="/marketplace?category=marine" className="group relative rounded-3xl overflow-hidden aspect-[4/3] sm:aspect-[16/9] flex items-center justify-center border border-slate-700 hover:border-blue-500 transition-colors">
              <div className="absolute inset-0 bg-slate-900/60 group-hover:bg-slate-900/40 transition-colors z-10"></div>
              <img 
                src="/bg-marine.png" 
                alt="Marine" 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
              />
              <div className="relative z-20 text-center">
                <Anchor className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-3xl font-black tracking-widest uppercase">Marine</h3>
                <p className="text-blue-100 mt-2 text-sm font-medium">Perikanan & Tangkapan Laut</p>
              </div>
            </Link>

          </div>
        </div>
      </section>
    </div>
  );
}
