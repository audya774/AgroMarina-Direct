import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { Leaf, Anchor, Search } from 'lucide-react'; // 🟢 Tambahkan ikon Search

// 🟢 Mengimpor desain kartu utama
import ProductCard from '../components/marketplace/ProductCard';

export default function JasaAgromarine() {
  const [services, setServices] = useState([]);
  const [activeSector, setActiveSector] = useState('Semua');
  const [loading, setLoading] = useState(true);
  
  // 🟢 State untuk menampung kata kunci pencarian
  const [searchQuery, setSearchQuery] = useState('');

  // Mengambil data dari tabel database
  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('Lapak') 
          .select('*')
          .eq('tipe', 'jasa');
        
        if (error) throw error;
        setServices(data || []);
      } catch (error) {
        console.error("Gagal memuat data jasa:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // 🟢 Logika Filter Ganda (Berdasarkan Kategori Sektor & Teks Pencarian)
  const filteredServices = services.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeSector === 'Semua') return matchSearch;
    return matchSearch && item.category?.toLowerCase().includes(activeSector.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* 🟢 Header Halaman & Kolom Pencarian (Kiri Kanan) */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Jasa Agromarine</h1>
            <p className="text-sm text-gray-500 mt-1">Temukan penyedia jasa pertanian dan kelautan terpercaya.</p>
          </div>
          
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Cari jasa panen, mekanik kapal..."
              className="w-full pl-10 pr-4 py-2 bg-slate-100 rounded-xl outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* 🌟 FILTER 1 TINGKAT */}
        <div className="flex items-center gap-2 w-full mt-6">
          <button 
            onClick={() => setActiveSector('Semua')} 
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm border ${
              activeSector === 'Semua' 
                ? 'bg-[#0F172A] text-white border-[#0F172A]' 
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            }`}
          >
            Semua 
          </button>
          
          <button 
            onClick={() => setActiveSector('Agro')} 
            className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm border ${
              activeSector === 'Agro' 
                ? 'bg-[#10B981] text-white border-[#10B981]' 
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Leaf className="w-4 h-4" /> Agro
          </button>
          
          <button 
            onClick={() => setActiveSector('Marine')} 
            className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm border ${
              activeSector === 'Marine' 
                ? 'bg-blue-600 text-white border-blue-600' 
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Anchor className="w-4 h-4" /> Marine
          </button>
        </div>

        {/* Grid Menampilkan Kartu Data */}
        {loading ? (
          <div className="py-12 text-center text-slate-500 font-medium">Memuat data jasa...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {filteredServices.length > 0 ? (
              filteredServices.map((item) => (
                // 🟢 Memanggil komponen ProductCard yang cerdas
                <ProductCard 
                  key={item.id || item.name} 
                  product={item} 
                />
              ))
            ) : (
              <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-dashed border-gray-300">
                <p className="text-gray-500 font-medium">Layanan jasa tidak ditemukan.</p>     
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
