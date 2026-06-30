import React from 'react';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const navigate = useNavigate();

  // Simulasi data keranjang (nantinya data ini diambil dari CartContext)
  const dummyCart = [
    { id: 1, nama: 'Ikan Tuna Segar', harga: 50000, jumlah: 10, penjual: 'Pak Ahmad (Kec. Trumon)' },
    { id: 2, nama: 'Biji Pala Pilihan', harga: 80000, jumlah: 2, penjual: 'Ibu Ratna (Kec. Tapaktuan)' }
  ];

  const totalHarga = dummyCart.reduce((total, item) => total + (item.harga * item.jumlah), 0);

  // Fungsi Checkout WhatsApp (Opsi 1)
  const handleWhatsAppCheckout = () => {
    const textPesanan = encodeURIComponent(
      `Halo Bapak/Ibu,\nSaya melihat lapak Anda di AgroMarina Direct dan ingin memesan:\n\n🛒 Total Belanja: Rp ${totalHarga.toLocaleString('id-ID')}\n\n🤝 Rencana COD/Pengiriman:\nNama Saya: ...\nAlamat/Titik Ketemuan: ...\n\nApakah stoknya tersedia?`
    );
    window.open(`https://wa.me/6281234567890?text=${textPesanan}`, '_blank');
  };

  // Fungsi Checkout Sistem (Opsi 2)
  const handleSystemCheckout = () => {
    navigate('/checkout'); // Arahkan ke halaman Checkout.jsx untuk isi form dan upload struk
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Kolom Kiri: Daftar Barang */}
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-2xl font-bold text-[#1E293B]">Keranjang Belanja</h2>
          
          {dummyCart.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm flex items-center justify-between border border-gray-100">
              <div>
                <h4 className="font-semibold text-gray-800">{item.nama}</h4>
                <p className="text-sm text-gray-500 text-xs mt-1">📍 Lapak: {item.penjual}</p>
                <p className="text-[#10B981] font-medium mt-2">
                  Rp {item.harga.toLocaleString('id-ID')} <span className="text-gray-400 text-sm">x {item.jumlah}</span>
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-800">Rp {(item.harga * item.jumlah).toLocaleString('id-ID')}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Kolom Kanan: Ringkasan & Opsi Checkout */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit mt-12 md:mt-0">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Ringkasan Belanja</h3>
          
          <div className="flex justify-between items-center mb-6 border-t border-gray-200 pt-4">
            <span className="text-gray-600 font-medium">Total Harga</span>
            <span className="text-xl font-bold text-[#1E293B]">Rp {totalHarga.toLocaleString('id-ID')}</span>
          </div>

          <p className="text-xs text-gray-500 mb-4 text-center">Pilih metode penyelesaian transaksi:</p>

          <div className="space-y-3">
            {/* Opsi 1: COD/WhatsApp */}
            <button 
              onClick={handleWhatsAppCheckout}
              className="w-full bg-[#25D366] text-white py-3 rounded-lg font-semibold hover:bg-[#1DA851] transition flex items-center justify-center gap-2"
            >
              Nego & COD (WhatsApp)
            </button>

            <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="flex-shrink-0 mx-4 text-gray-400 text-xs">ATAU</span>
                <div className="flex-grow border-t border-gray-200"></div>
            </div>

            {/* Opsi 2: Transfer Aplikasi */}
            <button 
              onClick={handleSystemCheckout}
              className="w-full bg-[#1E293B] text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
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
