import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import UploadForm from '../components/dashboard/UploadForm';
import OrderTable from '../components/dashboard/OrderTable';
import { LayoutDashboard, PackagePlus, ClipboardList, DollarSign, Package, TrendingUp, Camera, Image, ArrowLeft, Pencil, X, List, ShoppingCart } from 'lucide-react';

const DashboardMitra = () => {
  const [activeMenu, setActiveMenu] = useState('Keranjang');
  const [mitra, setMitra] = useState({ nama: 'Memuat...', avatarUrl: null });
  const [products, setProducts] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showProfileViewer, setShowProfileViewer] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  const fetchMyProducts = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from('Hasil') 
        .select('*')
        .eq('mitra_id', user.id);
      setProducts(data || []);
    }
  };

  useEffect(() => {
    fetchMyProducts();
  }, []);
  
  useEffect(() => {
    const handleBuka = () => setIsOpen(true);
    window.addEventListener('buka', handleBuka);
    return () => window.removeEventListener('buka', handleBuka);
  }, []);

  const targetPhone = "6281361293319";
  
  const textUpload = encodeURIComponent(`Halo Admin AgroMarina Direct,

Saya ingin meminta bantuan untuk melakukan *Upload Hasil* baru ke marketplace. Berikut detail hasil panen/tangkapan saya:

- Nama Hasil : 
- Kategori (Agro / Marine) : 
- Foto Hasil : (Silakan kirimkan fotonya di chat ini)
- Lokasi Panen/Tangkapan : 
- Harga Hasil (per kg/liter/ikat) : 

Mohon dibantu prosesnya. Terima kasih!`);

  const textUbahHarga = encodeURIComponent(`Halo Admin AgroMarina Direct,

Saya ingin meminta bantuan untuk melakukan *Perubahan Harga* pada hasil panen/tangkapan saya. Berikut detail perubahannya:

- Nama Hasil : 
- Kategori (Agro / Marine) : 
- Lokasi Panen/Tangkapan : 
- Harga Sebelumnya : 
- Harga Sekarang : 

Mohon dibantu prosesnya. Terima kasih!`);

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setMitra({
          nama: user.user_metadata?.namaLengkap || 'Mitra',
          avatarUrl: user.user_metadata?.avatarUrl || null
        });
      }
    };
    loadProfile();
  }, []);

  const handleUploadFoto = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setIsUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('profil')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('profil')
        .getPublicUrl(fileName);

      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatarUrl: publicUrl }
      });

      if (updateError) throw updateError;

      setMitra({ ...mitra, avatarUrl: publicUrl });
      alert('Foto profil berhasil diperbarui!');

    } catch (error) {
      alert('Gagal menyimpan. Pastikan Bucket "profil" sudah dibuat di Supabase Storage.');
      setMitra({ ...mitra, avatarUrl: URL.createObjectURL(file) });
    } finally {
      setIsUploading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/auth';
  };

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
    setIsOpen(false);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 relative">
      
      {/* =========================================
          LAYAR PENUH FOTO PROFIL (MODAL/OVERLAY)
          ========================================= */}
      {showProfileViewer && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col">
          {/* Header Bar */}
          <div className="flex items-center justify-between p-4 text-white bg-black">
            <div className="flex items-center gap-4">
              <button onClick={() => setShowProfileViewer(false)} className="p-2 hover:bg-gray-800 rounded-full transition">
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h2 className="text-xl font-medium">Foto profil</h2>
            </div>
            
            {/* Ikon Kamera & Galeri di Pojok Kanan Atas */}
            <div className="flex items-center gap-2">
              <button 
                onClick={() => document.getElementById('camera-upload').click()} 
                disabled={isUploading}
                className="p-2 hover:bg-gray-800 rounded-full transition"
                title="Buka Kamera"
              >
                <Camera className="w-6 h-6" />
              </button>
              <button 
                onClick={() => document.getElementById('gallery-upload').click()} 
                disabled={isUploading}
                className="p-2 hover:bg-gray-800 rounded-full transition"
                title="Buka Galeri"
              >
                <Image className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Area Foto Tengah */}
          <div className="flex-1 flex items-center justify-center p-4">
            {isUploading ? (
              <p className="text-white text-lg animate-pulse">Mengunggah foto...</p>
            ) : mitra.avatarUrl ? (
              <img src={mitra.avatarUrl} alt="Profil Full" className="w-full max-w-md max-h-full object-contain" />
            ) : (
              <div className="w-64 h-64 bg-[#10B981] rounded-full flex items-center justify-center text-white font-bold text-6xl">
                {mitra.nama.charAt(0)}
              </div>
            )}
          </div>
        </div>
      )}
      {/* ========================================= */}

      {/* Input File Tersembunyi */}
      <input 
        type="file" 
        id="camera-upload" 
        accept="image/*" 
        capture="user" 
        className="hidden" 
        onChange={handleUploadFoto} 
        disabled={isUploading} 
      />
      <input 
        type="file" 
        id="gallery-upload" 
        accept="image/*" 
        className="hidden" 
        onChange={handleUploadFoto} 
        disabled={isUploading} 
      />

      {/* LAYAR GELAP / OVERLAY */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity" 
          onClick={() => setIsOpen(false)} 
        />
      )}

      {/*  */}
    
      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-50 md:z-30 w-64 bg-[#0F172A] text-white flex flex-col shrink-0 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>

        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Mitra<span className="text-[#10B981]">Panel</span></h2>
          <button onClick={() => setIsOpen(false)} className="md:hidden p-2 text-gray-400 hover:text-white bg-gray-800 rounded-lg transition">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <button onClick={() => handleMenuClick('Keranjang')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeMenu === 'Keranjang' ? 'bg-[#10B981]' : 'hover:bg-gray-800'}`}>
            <ShoppingCart className="w-5 h-5" /> <span>Keranjang Hasil Saya</span>
          </button>
          <button onClick={() => handleMenuClick('ringkasan')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeMenu === 'ringkasan' ? 'bg-[#10B981]' : 'hover:bg-gray-800'}`}>
            <LayoutDashboard className="w-5 h-5" /> Ringkasan Bisnis
          </button>
          <button onClick={() => handleMenuClick('input')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeMenu === 'input' ? 'bg-[#10B981]' : 'hover:bg-gray-800'}`}>
            <PackagePlus className="w-5 h-5" /> Input Hasil Baru
          </button>
          <button onClick={() => handleMenuClick('pesanan')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeMenu === 'pesanan' ? 'bg-[#10B981]' : 'hover:bg-gray-800'}`}>
            <ClipboardList className="w-5 h-5" /> Daftar Pesanan
          </button>
          
          <div className="mt-8 pt-6 border-t border-gray-800">
            <p className="px-4 text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Bantuan Admin</p>
            <a href={`https://wa.me/${targetPhone}?text=${textUpload}`} target="_blank" rel="noopener noreferrer" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-800 text-gray-400 hover:text-[#10B981]">
              <PackagePlus className="w-5 h-5" /> Upload Hasil
            </a>
            <a href={`https://wa.me/${targetPhone}?text=${textUbahHarga}`} target="_blank" rel="noopener noreferrer" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-800 text-gray-400 hover:text-[#10B981]">
              <ClipboardList className="w-5 h-5" /> Ubah Harga
            </a>
          </div>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button onClick={handleLogout} className="w-full px-4 py-3 rounded-xl text-red-400 hover:bg-red-900/20 text-left">Keluar (Logout)</button>
        </div>
      </aside>

      {/* KONTEN UTAMA */}
      <main className="flex-1 p-6 md:p-10 w-full h-screen overflow-x-hidden overflow-y-auto">
        
        {/* TOMBOL PANEL MITRA KHUSUS MOBILE */}
        <div className="md:hidden mb-6">
          <button onClick={() => setIsOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-[#0F172A] text-white rounded-lg shadow-md hover:bg-slate-800 transition-all">
            <List className="w-5 h-5" />
            <span className="font-semibold text-sm">Mitra Panel</span>
          </button>
        </div>

        {/* KARTU PROFIL DI DASBOR */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border mb-8 flex items-center gap-6">
          <div onClick={() => setShowProfileViewer(true)} className="relative cursor-pointer transition-transform hover:scale-105 shrink-0" title="Lihat & Ubah Foto Profil">
            {mitra.avatarUrl ? (
              <img src={mitra.avatarUrl} alt="Profil" className="w-16 h-16 rounded-full object-cover border-2 border-[#10B981]" />
            ) : (
              <div className="w-16 h-16 bg-[#10B981] rounded-full flex shrink-0 items-center justify-center text-white font-bold text-2xl">
                {mitra.nama.charAt(0)}
              </div>
            )}
            <div className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow">
              <Pencil className="w-3 h-3 text-gray-600" />
            </div>
          </div>
          
          <div className="min-w-0">
            <h2 className="text-xl font-bold truncate">{mitra.nama}</h2>
            <p className="text-sm text-gray-500">Mitra Terdaftar</p>
          </div>
        </div>

        {/* KONTEN KERANJANG */}
        {activeMenu === 'Keranjang' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-extrabold text-[#1E293B]">Selamat Datang, Mitra!</h1> 
              <p className="text-gray-500 mt-1">Berikut adalah daftar produk yang Anda kelola di AgroMarina.</p>
            </div>
          
            <div className="grid gap-4">   
              {products.length > 0 ? (    
                products.map((hasil) => ( 
                  <div key={hasil.id} className="bg-white p-4 rounded-xl shadow-sm border flex justify-between items-center">
                    <div>
                      <h3 className="font-bold">{hasil.name}</h3> 
                      <p className="text-sm text-gray-500">Rp {hasil.price}</p>   
                    </div>
                    <div className="flex gap-2">
                      <button className="text-emerald-600 font-bold px-4 py-2 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition">Edit</button>
                      <button className="text-red-500 font-bold px-4 py-2 bg-red-50 rounded-lg hover:bg-red-100 transition">Hapus</button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">Belum ada hasil yang diunggah.</p>     
              )}   
            </div>
          </div>
        )}

        {/* KONTEN RINGKASAN */}
        {activeMenu === 'ringkasan' && (
          <div className="space-y-8">
            <div>
              <p className="text-gray-500 mt-1">Berikut adalah ringkasan performa penjualan Anda minggu ini.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div className="bg-emerald-50 p-3 rounded-2xl"><DollarSign className="text-emerald-500 w-6 h-6" /></div>
                  <p className="text-[12px] font-bold text-gray-500 uppercase">Total Pendapatan</p>
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-slate-800 truncate">Rp 4.250.000</p>
                  <div className="mt-2 space-y-0.5">
                    <p className="text-[11px] font-bold text-emerald-600">Agro: Rp 2.5jt</p>
                    <p className="text-[11px] font-bold text-blue-600">Marine: Rp 1.75jt</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div className="bg-blue-50 p-3 rounded-2xl"><Package className="text-blue-500 w-6 h-6" /></div>
                  <p className="text-[12px] font-bold text-gray-500 uppercase">Produk Terjual</p>
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-slate-800 truncate">125 kg</p>
                  <div className="mt-2 space-y-0.5">
                    <p className="text-[11px] font-bold text-emerald-600">Agro: 75kg</p>
                    <p className="text-[11px] font-bold text-blue-600">Marine: 50kg</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div className="bg-amber-50 p-3 rounded-2xl"><TrendingUp className="text-amber-500 w-6 h-6" /></div>
                  <p className="text-[12px] font-bold text-gray-500 uppercase">Performa Mingguan</p>
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-slate-800 truncate">85%</p>
                  <div className="mt-2 space-y-0.5">
                    <p className="text-[11px] font-bold text-emerald-600">Agro: 90%</p>
                    <p className="text-[11px] font-bold text-blue-600">Marine: 80%</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border">
              <h3 className="text-lg font-bold mb-8">Data Penjualan - Laporan Mingguan</h3>
              <svg viewBox="-40 -20 600 300" className="w-full h-72 overflow-visible">
                  <line x1="0" y1="0" x2="0" y2="205" stroke="#94a3b8" strokeWidth="2" />
                  <text x="-30" y="100" fontSize="14" fill="#64748b" textAnchor="middle" transform="rotate(-90, -30, 100)" fontWeight="bold">Banyaknya</text>
                  <line x1="0" y1="205" x2="550" y2="205" stroke="#94a3b8" strokeWidth="2" />
                  <text x="275" y="260" fontSize="14" fill="#64748b" textAnchor="middle" fontWeight="bold">Periode</text>
                  <polyline fill="none" stroke="#10B981" strokeWidth="3" points="20,155 120,125 220,145 320,85 420,65 520,45" />
              </svg>
            </div>
          </div>
        )}
        
        {activeMenu === 'input' && <UploadForm />}
        {activeMenu === 'pesanan' && <OrderTable />}
      </main>
    </div>
  );
};

export default DashboardMitra;
