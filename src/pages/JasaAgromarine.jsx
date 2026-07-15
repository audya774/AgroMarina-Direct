import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { Leaf, Anchor } from 'lucide-react'; // MapPin dihapus karena sudah diurus oleh ProductCard
import { useNavigate } from 'react-router-dom';

// 🟢 Mengimpor desain kartu utama
import ProductCard from '../components/marketplace/ProductCard';

export default function JasaAgromarine() {
  const [services, setServices] = useState([]);
  const [activeSector, setActiveSector] = useState('Semua');
  const [loading, setLoading] = useState(true);

  // 🟢 Menyiapkan fungsi navigasi
  const navigate = useNavigate();

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

  // Logika Filter 1 Tingkat 
  const filteredServices = services.filter((item) => {
    if (activeSector === 'Semua') return true;
    return item.category?.toLowerCase().includes(activeSector.toLowerCase());
  });

  // 🟢 Fungsi untuk menangani klik gambar (menuju halaman detail)
  const handleImageClick = (product) => {
    navigate(`/product/${product.name}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Halaman */}
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Jasa Agromarine</h1>
          <p className="text-sm text-gray-500 mt-1">Temukan penyedia jasa pertanian dan kelautan terpercaya.</p>
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
            Semua Hasil
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
                // 🟢 Memanggil komponen ProductCard yang seragam
                <ProductCard 
                  key={item.id || item.name} 
                  product={item} 
                  onImageClick={handleImageClick} 
                />
              ))
            ) : (
              <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-dashed border-gray-300">
                <p className="text-gray-500 font-medium">Belum ada layanan jasa di sektor ini.</p>     
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
