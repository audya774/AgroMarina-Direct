import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Package, Leaf, Anchor, X } from 'lucide-react';
import { supabase } from '../services/supabase';
import ProductCard from '../components/marketplace/ProductCard'; // 🟢 Memanggil komponen kartu produk terpisah

export default function Marketplace() {
  const [searchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get('category');

  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // 🟢 STATE UNTUK FITUR DETAIL & ULASAN TERVERIFIKASI
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
    setSelectedProduct(product);
    fetchReviews(product.name);
    // Reset formulir input ulasan
    setOrderIdInput('');
    setCommentInput('');
    setBuyerNameInput('');
    setRatingInput(5);
  };

  // Kirim ulasan dengan validasi ID Pesanan
  const handleSendReview = async (e) => {
    e.preventDefault();
    if (!orderIdInput || !commentInput || !buyerNameInput) {
      alert('Silakan isi semua kolom ulasan!');
      return;
    }

    try {
      // 1. Validasi ID Pesanan ke tabel 'Pesanan' kamu
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

      // 2. Jika ID Pesanan ditemukan & cocok, masukkan ulasan ke tabel 'Ulasan'
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
      fetchReviews(selectedProduct.name); // Refresh daftar ulasan di bawah produk
      setOrderIdInput('');
      setCommentInput('');
      setBuyerNameInput('');
    } catch (error) {
      alert('Gagal mengirim ulasan: ' + error.message);
    }
  };

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
              <ProductCard 
                key={product.id} 
                product={product} 
                onImageClick={handleProductClick} 
              />
            ))}
          </div>
        )}
      </div>

      {/* MODAL POP-UP DETAIL PRODUK + DESKRIPSI MITRA + INTEGRASI ULASAN TERVERIFIKASI */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-fade-in">
            
            {/* Header Modal */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Detail Produk</h2>
              <button 
                type="button" 
                onClick={() => setSelectedProduct(null)} 
                className="p-2 hover:bg-gray-100 rounded-full transition text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Konten Utama (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Gambar Besar Produk */}
              <div className="w-full aspect-[16/10] bg-gray-100 rounded-2xl overflow-hidden border border-gray-200">
                <img src={selectedProduct.image || "https://via.placeholder.com/600x400"} alt="Produk" className="w-full h-full object-cover" />
              </div>

              {/* Detail Info Harga & Lokasi */}
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{selectedProduct.name}</h3>
                    <p className="text-xs text-slate-500 mt-1">{selectedProduct.location}</p>
                  </div>
                  <span className="text-lg font-black text-emerald-600">
                    Rp {Number(selectedProduct.price).toLocaleString('id-ID')}/{selectedProduct.unit || 'Kg'}
                  </span>
                </div>
                
                {/* Deskripsi dari Mitra */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mt-2">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Deskripsi Mitra</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {selectedProduct.description || 'Mitra belum menambahkan deskripsi khusus untuk produk hasil panen ini.'}
                  </p>
                </div>
              </div>

              <hr className="border-gray-100" />

              {/* FORMULIR TULIS ULASAN BARU (MEMINTA VALIDASI ID PESANAN) */}
              <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-5 space-y-4">
                <h4 className="text-sm font-bold text-emerald-900 flex items-center gap-1.5">
                  <span className="p-1 bg-emerald-600 text-white rounded-md text-xs flex items-center justify-center w-5 h-5">✓</span> 
                  Tulis Ulasan Pembeli
                </h4>
                <form onSubmit={handleSendReview} className="space-y-3.5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 mb-1">ID Pesanan Anda *</label>
                      <input 
                        type="text"
                        placeholder="Contoh: ORDER-12345"
                        value={orderIdInput}
                        onChange={(e) => setOrderIdInput(e.target.value)}
                        className="w-full px-3 py-2 text-xs font-semibold bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 mb-1">Nama Anda *</label>
                      <input 
                        type="text"
                        placeholder="Nama Pembeli"
                        value={buyerNameInput}
                        onChange={(e) => setBuyerNameInput(e.target.value)}
                        className="w-full px-3 py-2 text-xs font-semibold bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-[11px] font-bold text-gray-500">Berikan Rating:</span>
                    <select 
                      value={ratingInput}
                      onChange={(e) => setRatingInput(e.target.value)}
                      className="px-2.5 py-1 text-xs font-bold bg-white border border-gray-200 rounded-lg focus:outline-none text-amber-500 cursor-pointer"
                    >
                      <option value="5">⭐⭐⭐⭐⭐ (5)</option>
                      <option value="4">⭐⭐⭐⭐ (4)</option>
                      <option value="3">⭐⭐⭐ (3)</option>
                      <option value="2">⭐⭐ (2)</option>
                      <option value="1">⭐ (1)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 mb-1">Ulasan Isi Komentar *</label>
                    <textarea 
                      rows="2"
                      placeholder="Bagaimana kualitas produk dan kesegaran hasil panen yang Anda terima?"
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      className="w-full p-3 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 shadow-sm resize-none"
                    ></textarea>
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition active:scale-95"
                  >
                    Kirim Ulasan Terverifikasi
                  </button>
                </form>
              </div>

              {/* DAFTAR ULASAN DARI PEMBELI LAIN */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  Ulasan & Rating ({reviews.length})
                </h4>
                
                {reviews.length === 0 ? (
                  <p className="text-xs text-gray-400 italic bg-gray-50 py-4 text-center rounded-xl border border-gray-100">
                    Belum ada ulasan terverifikasi untuk produk ini.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {reviews.map((rev) => (
                      <div key={rev.id} className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                            {rev.buyer_name}
                            <span className="text-[9px] bg-emerald-100 text-emerald-700 font-extrabold px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                              ✓ Terverifikasi
                            </span>
                          </span>
                          <span className="text-[10px] text-gray-400">
                            {new Date(rev.created_at).toLocaleDateString('id-ID')}
                          </span>
                        </div>
                        <div className="text-amber-400 text-xs font-bold">
                          {'⭐'.repeat(rev.rating)}
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed pt-1">
                          {rev.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
