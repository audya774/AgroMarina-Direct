import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { supabase } from '../services/supabase';

export default function ProductDetail() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]); 
  const [loading, setLoading] = useState(true);

  // State untuk Formulir Input Ulasan Baru
  const [orderIdInput, setOrderIdInput] = useState('');
  const [buyerNameInput, setBuyerNameInput] = useState('');
  const [ratingInput, setRatingInput] = useState(5);
  const [commentInput, setCommentInput] = useState('');

  // 1. Mengambil data produk spesifik berdasarkan kolom 'name' (Teks) dari URL
  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('Lapak')
          .select('*')
          .eq('name', id)
          .single();

        if (error) throw error;
        setProduct(data);
        
        // Ambil ulasan jika data produk berhasil didapatkan
        if (data) fetchReviews(data.name);
      } catch (error) {
        console.error("Gagal memuat detail produk:", error.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProductData();
  }, [id]);

  // 2. Fungsi mengambil ulasan berdasarkan nama produk dari tabel 'Ulasan'
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

  // 3. Fungsi mengirim ulasan baru dengan validasi ID Pesanan terverifikasi
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
        .eq('product_name', product.name)
        .single();

      if (orderError || !orderData) {
        alert('ID Pesanan tidak cocok atau tidak terdaftar untuk produk ini! Ulasan ditolak.');
        return;
      }

      const { error: reviewError } = await supabase
        .from('Ulasan')
        .insert([{
          product_name: product.name,
          buyer_name: buyerNameInput,
          order_id: orderIdInput,
          rating: parseInt(ratingInput),
          comment: commentInput,
          created_at: new Date()
        }]);

      if (reviewError) throw reviewError;

      alert('Ulasan Anda berhasil diterbitkan!');
      fetchReviews(product.name); 
      setOrderIdInput('');
      setCommentInput('');
      setBuyerNameInput('');
    } catch (error) {
      alert('Gagal mengirim ulasan: ' + error.message);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-slate-500 font-medium">Memuat detail produk dari database...</div>;
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-slate-600 gap-4">
        <p className="font-bold text-lg">Produk tidak ditemukan atau telah dihapus.</p>
        <button onClick={() => navigate('/marketplace')} className="px-4 py-2 bg-slate-800 text-white rounded-xl text-sm font-bold">
          Kembali ke Pasar
        </button>
      </div>
    );
  }

  return (
    // 🌟 PEMBUNGKUS UTAMA: Menggunakan py-10 agar memberi jarak aman ke navbar & footer
    <div className="min-h-screen bg-slate-50 font-sans py-10 px-4">
      
      {/* CARD DETAIL UTAMA: Lebar max-w-2xl, otomatis di tengah (mx-auto), border melengkung rapi */}
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-200/80 overflow-hidden">
        
        {/* Header Bar internal di dalam kartu */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-white">
         <h2 className="text-lg font-black text-gray-900">
         {product?.tipe === 'jasa' ? 'Detail Jasa' : product?.tipe === 'sewa' ? 'Detail Sewa' : 'Detail Produk'}
          </h2>
          <button 
            type="button" 
            onClick={() => navigate('/marketplace')} 
            className="p-2 hover:bg-gray-100 rounded-full transition text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Konten Di Dalam Kartu (Mengalir Bebas Kebawah Tanpa Dipaksa h-screen) */}
        <div className="p-6 space-y-6">
          
          {/* Gambar Besar Produk */}
          <div className="w-full aspect-[16/10] bg-gray-100 rounded-2xl overflow-hidden border border-gray-200">
            <img src={product.image || "https://via.placeholder.com/600x400"} alt={product.name} className="w-full h-full object-cover" />
          </div>

          {/* Detail Info Harga & Lokasi */}
          <div className="space-y-2">
            <div className="flex justify-between items-start gap-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{product.name}</h3>
                <p className="text-xs text-slate-500 mt-1">{product.location || 'Aceh Selatan'}</p>
              </div>
              <span className="text-lg font-black text-emerald-600 whitespace-nowrap">
                Rp {Number(product.price).toLocaleString('id-ID')}/{product.unit || 'Kg'}
              </span>
            </div>
            
            {/* Deskripsi dari Mitra */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mt-2">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Deskripsi Mitra</h4>
              <p className="text-sm text-gray-700 leading-relaxed">
                {product.description || 'Mitra belum menambahkan deskripsi khusus untuk produk hasil panen ini.'}
              </p>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* FORMULIR TULIS ULASAN BARU */}
          <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-5 space-y-4">
            <h4 className="text-sm font-bold text-emerald-900 flex items-center gap-1.5">
              <span className="p-1 bg-emerald-600 text-white rounded-md text-xs flex items-center justify-center w-5 h-5">✓</span> 
              {/* 🟢 JUDUL ULASAN DINAMIS */}
              {product?.tipe === 'sewa' 
                ? 'Tulis Ulasan Penyewa' 
                : product?.tipe === 'jasa' 
                  ? 'Tulis Ulasan Pelanggan' 
                  : 'Tulis Ulasan Pembeli'}
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
                    className="w-full px-3 py-2.5 text-xs font-semibold bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 mb-1">Nama Anda *</label>
                  <input 
                    type="text"
                    /* 🟢 PLACEHOLDER NAMA DINAMIS */
                    placeholder={
                      product?.tipe === 'sewa' 
                        ? 'Nama Penyewa' 
                        : product?.tipe === 'jasa' 
                          ? 'Nama Pelanggan' 
                          : 'Nama Pembeli'
                    }
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
                  className="px-2.5 py-1 text-xs font-bold bg-white border border-gray-200 rounded-lg text-amber-500 cursor-pointer focus:outline-none"
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

          {/* DAFTAR ULASAN */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              Ulasan & Rating ({reviews.length})
            </h4>
            
            {reviews.length === 0 ? (
              <p className="text-xs text-gray-400 italic bg-gray-50 py-6 text-center rounded-xl border border-gray-100">
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
  );
}
