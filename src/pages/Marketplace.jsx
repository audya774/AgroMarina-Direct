import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, Package, Leaf, Anchor, X } from 'lucide-react';
import { supabase } from '../services/supabase';
import ProductCard from '../components/marketplace/ProductCard'; 
const unitMapping = {
  'Bumi Agro': ['Kg', 'Liter', 'Ikat', 'Butir'],
  'Saprotan': ['Liter', 'Kg', 'Botol', 'Pcs'],
  'Marine Harvest': ['Kg', 'Ekor', 'Box'],
  'Sapronel': ['Meter', 'Pcs', 'Set'],
  'Agro Jasa': ['Hari', 'Layanan', 'Jam'],
  'Marine Jasa': ['Hari', 'Layanan', 'Jam'],
  'Agro Sewa': ['Hari', 'Jam', 'Musim'],
  'Marine Sewa': ['Hari', 'Jam', 'Musim'],
};

export default function Marketplace() {
  const [searchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get('category');
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [activeSector, setActiveSector] = useState('semua'); // 🟢 State Sektor Utama: 'semua', 'agro', 'marine'
  const [activeSub, setActiveSub] = useState('Bumi Agro'); // 🟢 State Sub-Kategori aktif
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // STATE UNTUK FITUR DETAIL & ULASAN TERVERIFIKASI
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [orderIdInput, setOrderIdInput] = useState('');
  const [ratingInput, setRatingInput] = useState(5);
  const [commentInput, setCommentInput] = useState('');
  const [buyerNameInput, setBuyerNameInput] = useState('');

  // Mengambil data dari database Supabase
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('Lapak')
        .select('*')
        .eq('tipe', 'pasar'); 
      if (error) console.error("Error fetching data:", error);
      else setProducts(data || []);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  // Menyesuaikan kategori jika ada parameter di URL belanjaan lama
  useEffect(() => {
    if (categoryFromUrl === 'agro') {
      setActiveSector('agro');
      setActiveSub('Bumi Agro');
    } else if (categoryFromUrl === 'marine') {
      setActiveSector('marine');
      setActiveSub('Marine Harvest');
    } else {
      setActiveSector('semua');
    }
  }, [categoryFromUrl]);

  // Ambil data ulasan dari Supabase berdasarkan nama produk
  const fetchReviews = async (productName) => {
    try {
      const { data, error } = await supabase
        .from('Ulasan')
        .select('*')
        .eq('product_name', productName)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Gagal memuat ulasan:', error.message);
    }
  };

  // Ketika gambar produk di dalam ProductCard diklik
    const handleProductClick = (product) => {
    navigate(`/product/${encodeURIComponent(product.name)}`); 
  };
  // Kirim ulasan dengan validasi ID Pesanan
  const handleSendReview = async (e) => {
    e.preventDefault();
    if (!orderIdInput || !commentInput || !buyerNameInput) {
      alert('Silakan isi semua kolom ulasan!');
      return;
    }

    try {
      const { data: orderData, error: orderError } = await supabase
        .from('Pesanan')
        .select('*')
        .eq('id', orderIdInput)
        .eq('product_name', selectedProduct.name)
        .single();

      if (orderError || !orderData) {
        alert('ID Pesanan tidak cocok atau tidak terdaftar untuk produk ini! Ulasan ditolak.');
        return;
      }

      const { error: reviewError } = await supabase
        .from('Ulasan')
        .insert([{
          product_name: selectedProduct.name,
          buyer_name: buyerNameInput,
          order_id: orderIdInput,
          rating: parseInt(ratingInput),
          comment: commentInput,
          created_at: new Date()
        }]);

      if (reviewError) throw reviewError;

      alert('Ulasan Anda berhasil diterbitkan!');
      fetchReviews(selectedProduct.name); 
      setOrderIdInput('');
      setCommentInput('');
      setBuyerNameInput('');
    } catch (error) {
      alert('Gagal mengirim ulasan: ' + error.message);
    }
  };

  // 🟢 LOGIKA FILTER HASIL ROMBAK TOTAL (Sektor + Sub-kategori Swipe + Pencarian)
  const filteredProducts = products.filter(product => {
    const matchSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeSector === 'semua') {
      return matchSearch;
    }
    
    // Jika berada di Sektor Agro, pastikan datanya cocok dengan sub-kategori yang aktif
    if (activeSector === 'agro') {
      return matchSearch && product.category?.toLowerCase().includes(activeSub.toLowerCase());
    }
    
    // Jika berada di Sektor Marine, pastikan datanya cocok dengan sub-kategori yang aktif
    if (activeSector === 'marine') {
      return matchSearch && product.category?.toLowerCase().includes(activeSub.toLowerCase());
    }
    
    return false;
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

          {/* 🟢 NAVIGATION TIER 1: SEKTOR UTAMA (Agro & Marine Kembali Asli) */}
          <div className="flex items-center gap-2 mt-6">
            <button 
              onClick={() => setActiveSector('semua')} 
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 ${activeSector === 'semua' ? 'bg-slate-800 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              Semua
            </button>
            <button 
              onClick={() => { setActiveSector('agro'); setActiveSub('Bumi Agro'); }} 
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 ${activeSector === 'agro' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              <Leaf className="w-4 h-4" /> Agro
            </button>
            <button 
              onClick={() => { setActiveSector('marine'); setActiveSub('Marine Harvest'); }} 
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 ${activeSector === 'marine' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              <Anchor className="w-4 h-4" /> Marine
            </button>
          </div>

          {/* 🟢 NAVIGATION TIER 2: SUB-KATEGORI SWIPE (Opsi Dinamis Berdasarkan Sektor) */}
          {activeSector !== 'semua' && (
            <div className="flex items-center gap-3 mt-4 overflow-x-auto pb-2 scroll-smooth snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none]">
              {activeSector === 'agro' ? (
                <>
                  <button 
                    onClick={() => setActiveSub('Bumi Agro')}
                    className={`snap-center px-4 py-2 rounded-xl text-xs font-black border transition-all whitespace-nowrap ${activeSub === 'Bumi Agro' ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm' : 'bg-white border-slate-200 text-slate-500'}`}
                  >
                    🥬 Bumi Agro
                  </button>
                  <button 
                    onClick={() => setActiveSub('Saprotan')}
                    className={`snap-center px-4 py-2 rounded-xl text-xs font-black border transition-all whitespace-nowrap ${activeSub === 'Saprotan' ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm' : 'bg-white border-slate-200 text-slate-500'}`}
                  >
                    📦 Saprotan
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => setActiveSub('Marine Harvest')}
                    className={`snap-center px-4 py-2 rounded-xl text-xs font-black border transition-all whitespace-nowrap ${activeSub === 'Marine Harvest' ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm' : 'bg-white border-slate-200 text-slate-500'}`}
                  >
                    🐟 Marine Harvest
                  </button>
                  <button 
                    onClick={() => setActiveSub('Sapronel')}
                    className={`snap-center px-4 py-2 rounded-xl text-xs font-black border transition-all whitespace-nowrap ${activeSub === 'Sapronel' ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm' : 'bg-white border-slate-200 text-slate-500'}`}
                  >
                    ⚓ Sapronel
                  </button>
                </>
              )}
            </div>
          )}

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
            <p className="text-slate-500 mt-2">Belum ada hasil panen terdaftar di kategori ini.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard 
                key={product.name} 
                product={product} 
                onImageClick={handleProductClick} 
              />
            ))}
          </div>
        )}
      </div>
  </div>
  );
}