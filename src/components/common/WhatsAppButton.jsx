import React from 'react';

const WhatsAppButton = () => {
  // Ganti dengan nomor WhatsApp Admin yang aktif (gunakan format 62 tanpa tanda + atau angka 0 di depan)
  const nomorAdmin = "6281234567890"; 
  
  // Template pesan otomatis
  const pesanBantuan = encodeURIComponent(
    "Halo Admin AgroMarina Direct,\n\nSaya butuh bantuan untuk memasukkan produk ke aplikasi. Berikut data saya:\n\n👤 Nama Penjual: \n📍 Desa/Kecamatan: \n📦 Kategori (Agro/Mari): \n🏷️ Nama Barang: \n💰 Harga: Rp \n\n(Foto barang akan saya kirim setelah ini)."
  );

  return (
    <a 
      href={`https://wa.me/${nomorAdmin}?text=${pesanBantuan}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center gap-2 bg-[#10B981] hover:bg-[#059669] text-white px-5 py-3 rounded-full shadow-xl hover:-translate-y-1 transition-all duration-300 border-2 border-white"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.36 6.64a9 9 0 1 1-12.73 0 9 9 0 0 1 12.73 0zM15 9.75l-2.25 2.25m0 0l-2.25 2.25M12.75 12l2.25 2.25M12.75 12l-2.25-2.25" />
      </svg>
      <span className="font-semibold text-sm">Bantuan Admin</span>
    </a>
  );
};

export default WhatsAppButton;
