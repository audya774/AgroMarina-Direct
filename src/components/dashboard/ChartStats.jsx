// src/components/dashboard/ChartStats.jsx
import React from 'react';
import { TrendingUp, DollarSign, Package } from 'lucide-react';

export default function ChartStats() {
  // Data simulasi untuk grafik (tinggi bar dalam persentase)
  const chartData = [40, 60, 45, 80, 50, 90, 70];

  return (
    <div className="space-y-8">
      {/* 1. KARTU STATISTIK (STAT CARDS) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Kartu Pendapatan */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm flex items-center space-x-4 hover:shadow-md transition-shadow group">
          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <DollarSign className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Pendapatan</p>
            <p className="text-2xl font-black text-slate-900 mt-1">Rp 4.250.000</p>
          </div>
        </div>
        
        {/* Kartu Produk Terjual */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm flex items-center space-x-4 hover:shadow-md transition-shadow group">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <Package className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Produk Terjual</p>
            <p className="text-2xl font-black text-slate-900 mt-1">
              125 <span className="text-sm font-medium text-slate-500">kg</span>
            </p>
          </div>
        </div>

        {/* Kartu Pesanan Aktif */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm flex items-center space-x-4 hover:shadow-md transition-shadow group">
          <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <TrendingUp className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pesanan Aktif</p>
            <p className="text-2xl font-black text-slate-900 mt-1">
              8 <span className="text-sm font-medium text-slate-500">menunggu</span>
            </p>
          </div>
        </div>
      </div>

      {/* 2. GRAFIK PERMINTAAN PASAR (CSS MURNI) */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/60 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h3 className="font-bold text-slate-800 flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-emerald-500" />
            <span>Grafik Permintaan Pasar</span>
          </h3>
          <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
            7 Hari Terakhir
          </span>
        </div>
        
        {/* Area Bar Chart */}
        <div className="flex items-end space-x-2 md:space-x-4 h-48 border-b border-slate-100 pb-2 relative">
          {/* Garis bantu horizontal (Grid lines) */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-30">
            <div className="border-t border-slate-300 w-full"></div>
            <div className="border-t border-slate-300 w-full"></div>
            <div className="border-t border-slate-300 w-full"></div>
          </div>

          {/* Render Bar Dinamis */}
          {chartData.map((height, i) => (
            <div key={i} className="flex-1 flex flex-col items-center group relative z-10 h-full">
              <div className="w-full bg-slate-100 rounded-t-lg relative flex items-end justify-center h-full overflow-hidden">
                <div 
                  className="w-full bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-lg transition-all duration-700 ease-out group-hover:opacity-80" 
                  style={{ height: `${height}%` }}
                ></div>
                
                {/* Tooltip Hover (Muncul saat kursor diarahkan ke bar) */}
                <div className="absolute bottom-full mb-2 bg-slate-800 text-white text-[10px] font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  {height} kg
                </div>
              </div>
              <span className="text-xs font-bold text-slate-400 mt-3">H-{7-i}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
