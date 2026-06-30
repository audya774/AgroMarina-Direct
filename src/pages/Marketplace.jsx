import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, MapPin, Package, ShoppingCart, Leaf, Anchor } from 'lucide-react';
import { supabase } from '../services/supabase';

export default function Marketplace() {
  const [searchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get('category');

  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Mengambil data dari database Supabase
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('Hasil').select('*');
      if (error) console.error("Error fetching data:", error);
      else setProducts(data || []);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  // Menyesuaikan kategori jika ada parameter di URL
  useEffect(() => {
    if (categoryFromUrl === 'agro' || categoryFromUrl === 'marine') {
      setActiveCategory(categoryFromUrl);
    } else {
      setActiveCategory('semua');
    }
  }, [categoryFromUrl]);

  // Logika Filter (Kategori & Pencarian)
  const filteredProducts = products.filter(product => {
    const matchCategory = activeCategory === 'semua' || product.category === activeCategory;
    const matchSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      {/* HEADER & PENCARIAN */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h1 className="text-2xl font-black text-slate-800">Pasar <span className="text-emerald-500">AgroMarina</span></h1>
              <p className="text-sm text-slate-500">Temukan hasil panen & laut langsung dari mitranya.</p>
            </div>
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Cari ikan, kopi, udang..."
                className="w-full pl-10 pr-4 py-2 bg-slate-100 rounded-xl outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* TAB FILTER KATEGORI */}
          <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-2">
            <button onClick={() => setActiveCategory('semua')} className={`px-5 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap ${activeCategory === 'semua' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600'}`}>
              Semua Hasil
            </button>
            <button onClick={() => setActiveCategory('agro')} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap ${activeCategory === 'agro' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600'}`}>
              <Leaf className="w-4 h-4" /> Agro
            </button>
            <button onClick={() => setActiveCategory('marine')} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap ${activeCategory === 'marine' ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-600'}`}>
              <Anchor className="w-4 h-4" /> Marine
            </button>
          </div>
        </div>
      </div>

      {/* GRID DAFTAR PRODUK */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {loading ? (
          <div className="text-center py-20 text-slate-500 font-medium">Memuat data dari database...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-700">Produk tidak ditemukan</h3>
            <p className="text-slate-500 mt-2">Coba kata kunci lain atau pilih kategori yang berbeda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="relative h-48 bg-slate-100">
                  {product.image && (
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  )}
                  <div className={`absolute top-3 left-3 px-3 py-1 rounded-lg text-xs font-bold text-white ${product.category === 'agro' ? 'bg-emerald-500' : 'bg-blue-500'}`}>
                    {product.category.toUpperCase()}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg text-slate-800 mb-1 line-clamp-1">{product.name}</h3>
                  <div className="flex items-center gap-1 text-slate-500 text-xs mb-3">
                    <MapPin className="w-3 h-3" /> <span className="line-clamp-1">{product.location}</span>
                  </div>
                  <div className="flex items-end justify-between mt-4 pt-4 border-t border-slate-100">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400">Harga per {product.unit}</p>
                      {/* Format Harga Rupiah dengan Titik */}
                      <p className="text-xl font-black text-slate-800">Rp {Number(product.price).toLocaleString('id-ID')}</p>
                    </div>
                    <button className={`p-3 rounded-xl text-white hover:opacity-90 transition-opacity ${product.category === 'agro' ? 'bg-emerald-500' : 'bg-blue-500'}`}>
                      <ShoppingCart className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

