import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, MapPin, Store, Wrench, CalendarClock, Minus, Plus } from 'lucide-react'; 
import { useCart } from '../context/CartContext'; 
import { supabase } from '../services/supabase'; 

const Cart = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, syncWithDatabase } = useCart();
  
  useEffect(() => {
    const fetchLatestData = async () => {
      // Jika keranjang kosong, tidak perlu cek database
      if (cart.length === 0) return;

      // 1. Kumpulkan semua ID barang yang ada di keranjang
      const itemIds = cart.map(item => item.id);

      // 2. Tarik data TERBARU dari Supabase HANYA untuk barang-barang tersebut
      const { data, error } = await supabase
        .from('products') // ⚠️ GANTI dengan nama tabel produk Anda di Supabase
        .select('id, stock, price')
        .in('id', itemIds);

      // 3. Jika berhasil, kirim data terbaru ke Context untuk diperbarui
      if (data && !error) {
        syncWithDatabase(data);
      }
    };

    fetchLatestData();
  }, []); // Array kosong [] memastikan ini hanya berjalan 1x saat keranjang dibuka

  const totalHarga = cart.reduce((total, item) => total + (item.price * (item.qty || 1)), 0);

  const handleWhatsAppCheckout = () => {
    if (cart.length === 0) return alert('Keranjang masih kosong!');

    const daftarBarang = cart.map((item) => 
      `- ${item.name} (${item.qty || 1} ${item.unit || 'Item'})`
    ).join('\n');

    const textPesanan = encodeURIComponent(
      `Halo, saya melihat lapak Anda di AgroMarina Direct dan ingin memesan:\n\n` +
      `Daftar Pesanan:\n${daftarBarang}\n\n` +
      `🛒 Total Belanja: Rp ${totalHarga.toLocaleString('id-ID')}\n\n` +
      `🤝 Rencana COD/Pengiriman:\nNama Saya: ...\nAlamat/Titik Ketemuan: ...\n\nApakah stok/unit tersedia?`
    );
    
    window.open(`https://wa.me/6281361293319?text=${textPesanan}`, '_blank');
  };

  const handleSystemCheckout = () => {
    if (cart.length === 0) return alert('Keranjang masih kosong!');
    navigate('/checkout'); 
  };
  
  return (
    <div className="w-full bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Kolom Kiri: Daftar Barang */}
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-2xl font-bold text-[#1E293B]">Keranjang Pesanan</h2>
          
          {cart.length === 0 ? (
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
              <p className="text-gray-500 font-medium">Keranjang Anda masih kosong.</p>
              <button onClick={() => navigate('/marketplace')} className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-lg font-bold text-sm">Belanja Sekarang</button>
            </div>
          ) : (
            cart.map((item) => {
              // LOGIKA KUSTOMISASI KOTAK
              let typeColor = 'border-l-emerald-500';
              let typeBadge = 'bg-emerald-100 text-emerald-700';
              let typeIcon = <Store className="w-3 h-3" />;
              let typeText = 'Pasar';

              if (item.tipe === 'jasa') {
                typeColor = 'border-l-amber-500';
                typeBadge = 'bg-amber-100 text-amber-700';
                typeIcon = <Wrench className="w-3 h-3" />;
                typeText = 'Jasa';
              } else if (item.tipe === 'sewa') {
                typeColor = 'border-l-blue-500';
                typeBadge = 'bg-blue-100 text-blue-700';
                typeIcon = <CalendarClock className="w-3 h-3" />;
                typeText = 'Sewa';
              }

              // LOGIKA STOK, SISA, DAN BATAS MAKSIMAL
              const currentStock = item.stock || 0;
              const currentQty = item.qty || 1;
              const unit = item.unit || 'Item';
              const remainingStock = Math.max(0, currentStock - currentQty);
              
              // Jika tipe jasa, kita anggap tidak ada batas limit (999). Jika barang fisik, pakai stok yang ada.
              const maxLimit = item.tipe === 'jasa' ? 999 : (item.stock || 999);

              // 🟢 FUNGSI KURANG
              const handleDecrease = () => {
                if (currentQty > 1 && updateQuantity) {
                   updateQuantity(item.id || item.name, currentQty - 1);
                }
              };

              // 🟢 FUNGSI TAMBAH (Dengan Pengecekan Stok)
              const handleIncrease = () => {
                if (currentQty >= maxLimit) {
                  alert(`Maaf, stok maksimal untuk ${item.name} hanya ${maxLimit} ${unit}.`);
                  return;
                }
                if (updateQuantity) {
                   updateQuantity(item.id || item.name, currentQty + 1);
                }
              };

              // 🟢 FUNGSI KETIK MANUAL (Dengan Validasi Pintar)
              const handleManualInput = (e) => {
                const inputValue = e.target.value;
                
                // Jika input dikosongkan secara manual, kita setel sementara ke 1 
                if (inputValue === '') {
                  updateQuantity(item.id || item.name, 1);
                  return;
                }

                const numValue = parseInt(inputValue, 10);

                if (numValue > maxLimit) {
                  // Tolak jika melebihi batas dan kembalikan ke angka maksimal
                  alert(`Stok tidak mencukupi! Sisa stok hanya ${maxLimit} ${unit}.`);
                  updateQuantity(item.id || item.name, maxLimit);
                } else if (numValue < 1) {
                  // Cegah angka minus atau nol
                  updateQuantity(item.id || item.name, 1);
                } else {
                  // Jika aman, masukkan angkanya
                  updateQuantity(item.id || item.name, numValue);
                }
              };

              return (
                <div 
                  key={item.id || item.name} 
                  className={`bg-white p-4 rounded-xl shadow-sm flex items-start justify-between border-y border-r border-gray-100 border-l-4 ${typeColor} transition-all hover:shadow-md`}
                >
                  
                  {/* --- BAGIAN KIRI KARTU --- */}
                  <div className="flex items-start gap-4">
                    <img src={item.image || "https://via.placeholder.com/80"} alt={item.name} className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg bg-gray-100 shrink-0" />
                    <div>
                      {/* Badge Tipe */}
                      <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold w-fit mb-1 ${typeBadge}`}>
                        {typeIcon} {typeText}
                      </div>

                      <h4 className="font-bold text-gray-800">{item.name}</h4>
                      
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3 shrink-0 text-gray-400" /> Lokasi: {item.location || 'AgroMarina'}
                      </p>
                      
                      <p className="text-[#10B981] font-bold mt-2">
                        Rp {Number(item.price).toLocaleString('id-ID')} <span className="text-gray-400 font-medium text-sm">x {currentQty} {unit}</span>
                      </p>

                      {/* INFO STOK & SISA */}
                      {item.tipe !== 'jasa' && (
                        <div className="mt-2 flex items-center gap-2 text-[10px] font-bold bg-gray-50 px-2 py-1 rounded-lg w-fit border border-gray-100">
                          <span className="text-gray-500">
                            {item.tipe === 'sewa' ? 'Unit' : 'Stok'}: {currentStock} {unit}
                          </span>
                          <span className="text-gray-300">|</span>
                          <span className={`${remainingStock === 0 ? 'text-red-500' : 'text-emerald-600'}`}>
                            Sisa: {remainingStock} {unit}
                          </span>
                        </div>
                      )}
                    </div>
                  </div> 
                  
                  {/* --- BAGIAN KANAN KARTU --- */}
                  <div className="flex flex-col items-end justify-between h-full min-h-[80px]">
                    <p className="font-black text-gray-800 text-lg">Rp {(item.price * currentQty).toLocaleString('id-ID')}</p>
                    
                    {/* AREA KONTROL: Kuantitas & Hapus */}
                    <div className="flex items-center gap-3 mt-auto pt-4">
                      
                      {/* Kontrol Kuantitas Input Manual */}
                      <div className="flex items-center bg-gray-100 rounded-lg p-1 border border-gray-200 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 transition-all">
                        <button 
                          onClick={handleDecrease}
                          disabled={currentQty <= 1}
                          className="p-1 text-gray-600 hover:text-emerald-600 disabled:opacity-30 transition"
                        >
                          <Minus className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                        
                        {/* 🟢 INPUT KETIK MANUAL */}
                        <input
                          type="number"
                          value={currentQty}
                          onChange={handleManualInput}
                          className="w-8 text-center text-sm font-bold text-gray-800 bg-transparent outline-none p-0 m-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <span className="text-[10px] font-medium text-gray-500 mr-2">{unit}</span>
                        
                        <button 
                          onClick={handleIncrease}
                          disabled={currentQty >= maxLimit}
                          className="p-1 text-gray-600 hover:text-emerald-600 disabled:opacity-30 transition"
                        >
                          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      </div>

                      {/* Tombol Hapus */}
                      <button 
                        onClick={() => removeFromCart(item.id || item.name)} 
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Hapus dari keranjang"
                      >
                        <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>

                    </div>
                  </div>

                </div>
              );
            })
          )}
        </div>

        {/* Kolom Kanan: Ringkasan & Opsi Checkout */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit mt-12 md:mt-0 sticky top-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Ringkasan Pesanan</h3>
          
          <div className="flex justify-between items-center mb-6 border-t border-gray-200 pt-4">
            <span className="text-gray-600 font-medium">Total Harga</span>
            <span className="text-xl font-black text-[#1E293B]">Rp {totalHarga.toLocaleString('id-ID')}</span>
          </div>

          <p className="text-xs text-gray-500 mb-4 text-center font-medium">Pilih metode penyelesaian transaksi:</p>

          <div className="space-y-3">
            <button 
              onClick={handleWhatsAppCheckout}
              disabled={cart.length === 0}
              className="w-full bg-[#25D366] text-white py-3 rounded-xl font-bold hover:bg-[#1DA851] active:scale-95 transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 disabled:active:scale-100"
            >
              Nego & COD (WhatsApp)
            </button>

            <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="flex-shrink-0 mx-4 text-gray-400 text-[10px] font-black tracking-widest uppercase">Atau</span>
                <div className="flex-grow border-t border-gray-200"></div>
            </div>

            <button 
              onClick={handleSystemCheckout}
              disabled={cart.length === 0}
              className="w-full bg-[#1E293B] text-white py-3 rounded-xl font-bold hover:bg-gray-800 active:scale-95 transition-all shadow-sm disabled:opacity-50 disabled:active:scale-100"
            >
              Transfer & Upload Struk
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Cart;
