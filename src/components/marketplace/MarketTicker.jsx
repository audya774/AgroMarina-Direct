import React, { useState, useEffect } from 'react';
import { TrendingUp } from 'lucide-react';

export default function MarketTicker() {
  // Simulasi Harga Pasar Real-Time
  const [tickerPrices, setTickerPrices] = useState([
    { name: "Ikan Tongkol Segar", price: 35000, trend: "up" },
    { name: "Pala (Trumon)", price: 45000, trend: "up" },
    { name: "Kakao Organik", price: 65000, trend: "down" },
    { name: "Kopi Gayo Arabika", price: 120000, trend: "up" },
    { name: "Udang Vaname", price: 85000, trend: "stable" }
  ]);

  // Efek Pergerakan Harga (Berubah setiap 4 detik untuk presentasi juri)
  useEffect(() => {
    const interval = setInterval(() => {
      setTickerPrices(prev => prev.map(item => {
        // Simulasi fluktuasi acak (Naik/Turun maksimal Rp 1.000)
        const change = (Math.random() - 0.5) * 2000; 
        const newPrice = Math.max(10000, Math.round((item.price + change) / 100) * 100); // Dibulatkan ratusan
        
        return {
          ...item,
          price: newPrice,
          trend: change > 50 ? "up" : change < -50 ? "down" : "stable"
        };
      }));
    }, 4000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-900 text-white text-xs py-2.5 px-4 shadow-inner overflow-hidden border-b border-slate-700 flex items-center">
      {/* Label Kiri */}
      <div className="flex items-center space-x-2 mr-6 shrink-0 bg-slate-800 px-3 py-1 rounded-full shadow-sm border border-slate-700">
        <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
        <span className="font-bold text-amber-400 tracking-wider text-[10px] uppercase">Live Market</span>
      </div>
      
      {/* Ticker Berjalan */}
      <div className="flex space-x-8 animate-pulse overflow-x-auto no-scrollbar">
        {tickerPrices.map((ticker, index) => (
          <div key={index} className="flex items-center space-x-2 border-r border-slate-700 pr-6 shrink-0 transition-colors duration-300">
            <span className="text-slate-300 font-medium">{ticker.name}:</span>
            <span className={`font-mono font-bold ${
              ticker.trend === "up" ? "text-emerald-400" : 
              ticker.trend === "down" ? "text-red-400" : "text-blue-400"
            }`}>
              Rp {ticker.price.toLocaleString('id-ID')}
            </span>
            <span className="text-sm">
              {ticker.trend === "up" ? "🔺" : ticker.trend === "down" ? "🔻" : "🔹"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
