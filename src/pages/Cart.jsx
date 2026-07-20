import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, MapPin, Store, Wrench, CalendarClock, Minus, Plus, ShoppingCart, CheckCircle2 } from 'lucide-react'; 
import { useCart } from '../context/CartContext'; 
import { supabase } from '../services/supabase'; 

const Cart = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, updateDuration, syncWithDatabase } = useCart();
  
  // 🟢 State untuk melacak item mana yang dipilih untuk ringkasan belanja & checkout
  const [selectedItemId, setSelectedItemId] = useState(null);

  useEffect(() => {
    if (cart.length > 0 && !selectedItemId) {
      setSelectedItemId(cart[0].id || cart[0].name);
    } else if (cart.length === 0) {
      setSelectedItemId(null);
    }
  }, [cart, selectedItemId]);
  
  useEffect(() => {
    const fetchLatestData = async () => {
      if (cart.length === 0) return;

      const itemIds = cart.map(item => item.id);
      const { data, error } = await supabase
        .from('products') 
        .select('id, stock, price')
        .in('id', itemIds);

      if (data && !error) {
        syncWithDatabase(data);
      }
    };

    fetchLatestData();
  }, []); 

  // 🟢 Hanya menghitung harga dari item yang sedang dipilih/aktif saja
  const activeItem = cart.find(item => (item.id || item.name) === selectedItemId) || cart[0];

  const totalHarga = activeItem ? (
    activeItem.price * 
    (activeItem.qty || 1) * 
    (activeItem.tipe === 'sewa' ? (activeItem.duration || 1) : 1)
  ) : 0;

  const handleWhatsAppCheckout = () => {
    if (!activeItem) return alert('Keranjang masih kosong!');

    const isJasa = activeItem.tipe === 'jasa';
    const qty = activeItem.qty || 1;
    const dur = activeItem.duration || 1;
    const unitStr = activeItem.unit || (isJasa ? 'Hari' : 'Item');

    let daftarBarang = '';
    if (activeItem.tipe === 'sewa') {
      daftarBarang = `- ${activeItem.name} (${qty} Unit, Durasi: ${dur} ${unitStr})`;
    } else {
      daftarBarang = `- ${activeItem.name} (${qty} ${unitStr})`;
    }

    let textPesanan = '';

    if (isJasa) {
      textPesanan = encodeURIComponent(
        `Halo, saya melihat layanan Anda di AgroMarina Direct dan ingin memesan:\n\n` +
        `Daftar Layanan:\n${daftarBarang}\n\n` +
        `💰 Estimasi Biaya: Rp ${totalHarga.toLocaleString('id-ID')}\n\n` +
        `🤝 Rencana Pelaksanaan (Bayar di Tempat):\nNama Saya: ...\nLokasi Pengerjaan: ...\nRencana Tanggal/Waktu: ...\n\nApakah Anda tersedia untuk jadwal tersebut?`
      );
    } else {
      textPesanan = encodeURIComponent(
        `Halo, saya melihat lapak Anda di AgroMarina Direct dan ingin memesan:\n\n` +
        `Daftar Pesanan:\n${daftarBarang}\n\n` +
        `🛒 Total Belanja: Rp ${totalHarga.toLocaleString('id-ID')}\n\n` +
        `🤝 Rencana COD/Pengiriman:\nNama Saya: ...\nAlamat/Titik Ketemuan: ...\n\nApakah stok/unit tersedia?`
      );
    }
    
    window.open(`https://wa.me/6281361293319?text=${textPesanan}`, '_blank');
  };

  const handleSystemCheckout = () => {
    if (cart.length === 0) return alert('Keranjang masih kosong!');
    navigate('/checkout', { state: { selectedItemId } }); 
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
              const isSelected = selectedItemId === (item.id || item.name);

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

              const currentStock = item.stock || 0;
              const currentQty = item.qty || 1;
              const unit = item.unit || 'Item';
              const remainingStock = Math.max(0, currentStock - currentQty);
              const maxLimit = item.tipe === 'jasa' ? 999 : (item.stock || 999);
              
              const handleDecrease = () => {
                if (currentQty > 1 && updateQuantity) {
                   updateQuantity(item.id || item.name, currentQty - 1);
                }
              };

              const handleIncrease = () => {
                if (currentQty >= maxLimit) {
                  alert(`Maaf, stok maksimal untuk ${item.name} hanya ${maxLimit} ${unit}.`);
                  return;
                }
                if (updateQuantity) {
                   updateQuantity(item.id || item.name, currentQty + 1);
                }
              };

              const handleManualInput = (e) => {
                const inputValue = e.target.value;
                if (inputValue === '') {
                  updateQuantity(item.id || item.name, 1);
                  return;
                }

                const numValue = parseInt(inputValue, 10);
                if (numValue > maxLimit) {
                  alert(`Stok tidak mencukupi! Sisa stok hanya ${maxLimit} ${unit}.`);
                  updateQuantity(item.id || item.name, maxLimit);
                } else if (numValue < 1) {
                  updateQuantity(item.id || item.name, 1);
                } else {
                  updateQuantity(item.id || item.name, numValue);
                }
              };
             
              const currentDuration = item.duration || 1;
              const maxDuration = 7; // 🟢 Durasi maksimal diset ke 7 hari
              
              const itemSubtotal = item.tipe === 'sewa' 
                ? (item.price * currentQty * currentDuration) 
                : (item.price * currentQty);

              const handleDecreaseDuration = () => {
                if (currentDuration > 1 && updateDuration) updateDuration(item.id || item.name, currentDuration - 1);
              };
              const handleIncreaseDuration = () => {
                if (currentDuration >= maxDuration) return alert(`Maksimal durasi sewa adalah ${maxDuration} ${unit}.`);
                if (updateDuration) updateDuration(item.id || item.name, currentDuration + 1);
              };
              const handleManualDuration = (e) => {
                const val = e.target.value;
                if (val === '') return updateDuration(item.id || item.name, 1);
                const num = parseInt(val, 10);
                if (num > maxDuration) {
                  alert(`Maksimal durasi sewa adalah ${maxDuration} ${unit}.`);
                  updateDuration(item.id || item.name, maxDuration);
                } else if (num < 1) updateDuration(item.id || item.name, 1);
                else updateDuration(item.id || item.name, num);
              };

              const cardStyle = isSelected 
                ? `bg-white p-4 rounded-xl shadow-md border-y border-r border-gray-100 border-l-4 ${typeColor} ring-1 ring-emerald-400 transition-all mb-4 cursor-pointer`
                : `bg-gray-50/70 p-4 rounded-xl shadow-sm border border-gray-100 border-l-4 ${typeColor} opacity-75 hover:opacity-100 transition-all mb-4 cursor-pointer`;

              return (
                <div key={item.id || item.name} className={cardStyle} onClick={() => setSelectedItemId(item.id || item.name)}>
                  
                  {/* --- BARIS 1: INFO PRODUK (ATAS) --- */}
                  <div className="flex gap-3 w-full">
                    <img src={item.image || "https://via.placeholder.com/80"} alt={item.name} className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl bg-gray-100 shrink-0 border border-gray-100" />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <div className="min-w-0">
                          <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold w-fit mb-1 ${typeBadge}`}>
                            {typeIcon} {typeText}
                          </div>
                          <h4 className="font-bold text-gray-800 text-sm sm:text-base truncate" title={item.name}>{item.name}</h4>
                        </div>
                      </div>
                      
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-1 truncate">
                        <MapPin className="w-3 h-3 shrink-0 text-gray-400" /> {item.location || 'AgroMarina'}
                      </p>
                      
                      {/* Harga & Tombol Aksi di Pojok Kanan Bawah */}
                      <div className="mt-2 flex items-end justify-between">
                        <div>
                          <p className="text-[#10B981] font-bold text-sm sm:text-base">
                            Rp {Number(item.price).toLocaleString('id-ID')} 
                            <span className="text-gray-400 font-medium text-[10px] sm:text-xs ml-1">
                              {item.tipe === 'sewa' ? `x ${currentQty} Unit x ${currentDuration} ${unit}` : `x ${currentQty} ${unit}`}
                            </span>
                          </p>

                          {item.tipe !== 'jasa' && (
                            <div className="mt-1 flex items-center gap-2 text-[9px] sm:text-[10px] font-bold bg-white px-2 py-1 rounded-md w-fit border border-gray-100">
                              <span className="text-gray-500">Stok: {currentStock}</span>
                              <span className="text-gray-300">|</span>
                              <span className={`${remainingStock === 0 ? 'text-red-500' : 'text-emerald-600'}`}>Sisa: {remainingStock}</span>
                            </div>
                          )}
                        </div>

                        {/* 🟢 Ikon Keranjang & Sampah di Samping Kanan Bawah */}
                        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <button 
                            onClick={() => setSelectedItemId(item.id || item.name)} 
                            className={`p-1.5 rounded-lg transition shadow-sm ${isSelected ? 'bg-emerald-600 text-white' : 'bg-white border border-gray-200 text-gray-400 hover:text-emerald-600'}`}
                            title={isSelected ? 'Dipilih' : 'Pilih Item Ini'}
                          >
                            {isSelected ? <CheckCircle2 className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
                          </button>

                          <button 
                            onClick={() => removeFromCart(item.id || item.name)} 
                            className="p-1.5 bg-white border border-gray-200 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg shadow-sm transition" 
                            title="Hapus dari keranjang"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                    </div>
                  </div> 
                  
                  {/* --- BARIS 2: KONTROL & SUBTOTAL (BAWAH) --- */}
                  <div className="mt-4 pt-3 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4" onClick={(e) => e.stopPropagation()}>
                    
                    {/* Area Kontrol (-/+) Menyamping */}
                    <div className="w-full sm:w-auto">
                      {item.tipe === 'sewa' ? (
                        <div className="flex flex-row items-center gap-2 sm:gap-4 overflow-x-auto py-1">
                          {/* Unit */}
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Unit:</span>
                            <div className="flex items-center bg-gray-50 rounded-lg p-1 border border-gray-200">
                              <button onClick={handleDecrease} disabled={currentQty <= 1} className="p-1 text-gray-600 disabled:opacity-30"><Minus className="w-3 h-3" /></button>
                              <input type="number" value={currentQty} onChange={handleManualInput} className="w-6 text-center text-xs font-bold text-gray-800 bg-transparent outline-none p-0 m-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none" />
                              <button onClick={handleIncrease} disabled={currentQty >= maxLimit} className="p-1 text-gray-600 disabled:opacity-30"><Plus className="w-3 h-3" /></button>
                            </div>
                          </div>

                          {/* Durasi */}
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Durasi:</span>
                            <div className="flex items-center bg-gray-50 rounded-lg p-1 border border-gray-200">
                              <button onClick={handleDecreaseDuration} disabled={currentDuration <= 1} className="p-1 text-gray-600 disabled:opacity-30"><Minus className="w-3 h-3" /></button>
                              <input type="number" value={currentDuration} onChange={handleManualDuration} className="w-6 text-center text-xs font-bold text-gray-800 bg-transparent outline-none p-0 m-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none" />
                              <span className="text-[10px] font-medium text-gray-500 mr-1">{unit}</span>
                              <button onClick={handleIncreaseDuration} disabled={currentDuration >= maxDuration} className="p-1 text-gray-600 disabled:opacity-30"><Plus className="w-3 h-3" /></button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between sm:justify-start gap-4">
                          <span className="text-[10px] font-bold text-gray-400 uppercase w-12 sm:hidden tracking-wider">Jumlah:</span>
                          <div className="flex items-center bg-gray-50 rounded-lg p-1 border border-gray-200">
                            <button onClick={handleDecrease} disabled={currentQty <= 1} className="p-1.5 text-gray-600 disabled:opacity-30"><Minus className="w-3 h-3 sm:w-4 sm:h-4" /></button>
                            <input type="number" value={currentQty} onChange={handleManualInput} className="w-8 text-center text-xs sm:text-sm font-bold text-gray-800 bg-transparent outline-none p-0 m-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none" />
                            <span className="text-[10px] font-medium text-gray-500 mr-2">{unit}</span>
                            <button onClick={handleIncrease} disabled={currentQty >= maxLimit} className="p-1.5 text-gray-600 disabled:opacity-30"><Plus className="w-3 h-3 sm:w-4 sm:h-4" /></button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Area Subtotal */}
                    <div className="flex items-center justify-between sm:block border-t border-gray-50 sm:border-none pt-3 mt-2 sm:pt-0 sm:mt-0">
                      <span className="text-[10px] font-bold text-gray-400 uppercase sm:hidden tracking-wider">Subtotal:</span>
                      <p className="font-black text-emerald-600 text-lg">Rp {itemSubtotal.toLocaleString('id-ID')}</p>
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
            <div className="flex flex-col">
              <span className="text-gray-600 font-medium">Total Harga</span>
              <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md mt-0.5 w-fit">1 Item Terpilih</span>
            </div>
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
