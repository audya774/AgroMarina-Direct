import React, { useState } from 'react';
import { 
  MapPin, 
  Truck, 
  CreditCard, 
  ShieldCheck, 
  CheckCircle2, 
  Wallet, 
  ArrowRight,
  Info,
  Banknote
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom'; // 🟢 Tambahkan useLocation
import { useCart } from '../context/CartContext'; 
import { supabase } from '../services/supabase'; 

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation(); // 🟢 Menerima kiriman state dari Cart.jsx
  const { cart, clearCart } = useCart(); 
  
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('escrow');
  const [receiptFile, setReceiptFile] = useState(null); 
  const [isProcessing, setIsProcessing] = useState(false);
  const [finalOrderInfo, setFinalOrderInfo] = useState(null);

  // 🟢 Mendapatkan ID item yang dipilih dari Cart, atau default ke item pertama
  const selectedItemId = location.state?.selectedItemId;
  const activeItem = cart.find(i => (i.id || i.name) === selectedItemId) || cart[0];

  // State Formulir Data Pembeli
  const [formData, setFormData] = useState({
    nama: 'Muhammad Khairuddin',
    hp: '081234567890',
    alamat: 'Jl. Teuku Nyak Arief, Darussalam, Kec. Syiah Kuala, Kota Banda Aceh'
  });

  // 🟢 Menghitung subtotal HANYA dari item yang dipilih/aktif saja
  const subTotal = activeItem ? (
    activeItem.price * 
    (activeItem.qty || 1) * 
    (activeItem.tipe === 'sewa' ? (activeItem.duration || 1) : 1)
  ) : 0;

  const shippingCost = 25000; 
  const total = subTotal > 0 ? subTotal + shippingCost : 0;

  const handleNextStep = async (e) => {
    if (e) e.preventDefault();
    
    if (step === 1) {
      if (cart.length === 0 || !activeItem) return alert('Keranjang atau item pilihan kosong!');
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } 
    else if (step === 2) {
      if (paymentMethod === 'transfer' && !receiptFile) {
        alert('Mohon unggah bukti transfer/struk Anda terlebih dahulu.');
        return;
      }

      setIsProcessing(true);
      
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setFinalOrderInfo({
          orderId: `AM-${Math.floor(Math.random() * 10000)}-XYZ`,
          totalPaid: total,
          method: paymentMethod
        });

        clearCart(); 
        setStep(3);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (error) {
        alert('Gagal memproses pembayaran: ' + error.message);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  if (cart.length === 0 && step < 3) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Keranjang Anda Kosong</h2>
        <p className="text-slate-500 mb-6">Silakan pilih produk dari pasar terlebih dahulu.</p>
        <button onClick={() => navigate('/marketplace')} className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold">
          Kembali ke Pasar
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-8 pb-20 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Progress Tracker */}
        <div className="flex items-center justify-center mb-10">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold transition-colors ${step >= 1 ? 'bg-emerald-600 text-white shadow-lg' : 'bg-slate-200 text-slate-500'}`}>1</div>
            <div className={`w-12 h-1 rounded-full transition-colors ${step >= 2 ? 'bg-emerald-600' : 'bg-slate-200'}`}></div>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold transition-colors ${step >= 2 ? 'bg-emerald-600 text-white shadow-lg' : 'bg-slate-200 text-slate-500'}`}>2</div>
            <div className={`w-12 h-1 rounded-full transition-colors ${step >= 3 ? 'bg-emerald-600' : 'bg-slate-200'}`}></div>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold transition-colors ${step >= 3 ? 'bg-emerald-600 text-white shadow-lg' : 'bg-slate-200 text-slate-500'}`}>3</div>
          </div>
        </div>

        {step < 3 ? (
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Kiri: Form Input */}
            <div className="w-full lg:w-2/3 space-y-6">
              
              {/* STEP 1: PENGIRIMAN */}
              {step === 1 && (
                <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/60 shadow-sm animate-slide-in">
                  <div className="flex items-center space-x-3 mb-6 border-b border-slate-100 pb-4">
                    <div className="p-2 bg-blue-100 rounded-xl text-blue-600"><MapPin className="w-5 h-5" /></div>
                    <h2 className="text-xl font-bold text-slate-900">Informasi Pengiriman</h2>
                  </div>

                  <div className="mb-8 bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
                    <div className="text-center flex-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Titik Asal (Mitra)</p>
                      <p className="font-semibold text-slate-800 text-sm mt-1">Aceh Selatan</p>
                    </div>
                    <div className="px-4 text-slate-300 flex flex-col items-center">
                      <Truck className="w-5 h-5 text-emerald-500 mb-1" />
                      <div className="w-16 h-0.5 bg-emerald-200 border-dashed border-b-2"></div>
                    </div>
                    <div className="text-center flex-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Tujuan Anda</p>
                      <p className="font-semibold text-slate-800 text-sm mt-1">Banda Aceh</p>
                    </div>
                  </div>

                  <form id="shipping-form" onSubmit={handleNextStep} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Nama Penerima</label>
                        <input type="text" required value={formData.nama} onChange={(e) => setFormData({...formData, nama: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none bg-slate-50" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Nomor HP / WhatsApp</label>
                        <input type="tel" required value={formData.hp} onChange={(e) => setFormData({...formData, hp: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none bg-slate-50" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Alamat Lengkap Tujuan</label>
                      <textarea required rows="3" value={formData.alamat} onChange={(e) => setFormData({...formData, alamat: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none bg-slate-50"></textarea>
                    </div>
                  </form>
                </div>
              )}

              {/* STEP 2: PEMBAYARAN */}
              {step === 2 && (
                <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/60 shadow-sm animate-slide-in">
                  <div className="flex items-center space-x-3 mb-6 border-b border-slate-100 pb-4">
                    <div className="p-2 bg-amber-100 rounded-xl text-amber-600"><CreditCard className="w-5 h-5" /></div>
                    <h2 className="text-xl font-bold text-slate-900">Metode Pembayaran</h2>
                  </div>

                  <div className="space-y-4">
                    <label className={`block p-4 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'escrow' ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-100 hover:border-slate-200 bg-white'}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <input type="radio" name="payment" value="escrow" checked={paymentMethod === 'escrow'} onChange={() => setPaymentMethod('escrow')} className="w-5 h-5 text-emerald-600 focus:ring-emerald-500" />
                          <div>
                            <span className="font-bold text-slate-800 block">Rekening Bersama (Escrow)</span>
                            <span className="text-xs text-slate-500">Dana ditahan AgroMarina sampai barang tiba dengan aman.</span>
                          </div>
                        </div>
                        <ShieldCheck className={`w-6 h-6 ${paymentMethod === 'escrow' ? 'text-emerald-500' : 'text-slate-300'}`} />
                      </div>
                    </label>

                    <label className={`block p-4 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'transfer' ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-100 hover:border-slate-200 bg-white'}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <input type="radio" name="payment" value="transfer" checked={paymentMethod === 'transfer'} onChange={() => setPaymentMethod('transfer')} className="w-5 h-5 text-emerald-600 focus:ring-emerald-500" />
                          <div>
                            <span className="font-bold text-slate-800 block">Transfer Bank Manual</span>
                            <span className="text-xs text-slate-500">BSI, Mandiri, BCA. (Wajib upload struk)</span>
                          </div>
                        </div>
                        <CreditCard className={`w-6 h-6 ${paymentMethod === 'transfer' ? 'text-emerald-500' : 'text-slate-300'}`} />
                      </div>
                      
                      {paymentMethod === 'transfer' && (
                        <div className="mt-4 pt-4 border-t border-emerald-100 animate-fade-in pl-9">
                          <p className="text-xs font-bold text-slate-700 mb-2">Silakan transfer ke BSI 1234567890 (a.n AgroMarina)</p>
                          <div className="relative">
                            <input 
                              type="file" 
                              accept="image/*" 
                              onChange={(e) => setReceiptFile(e.target.files[0])}
                              className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-100 file:text-emerald-700 hover:file:bg-emerald-200 cursor-pointer"
                            />
                          </div>
                        </div>
                      )}
                    </label>

                    <label className={`block p-4 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-100 hover:border-slate-200 bg-white'}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="w-5 h-5 text-emerald-600 focus:ring-emerald-500" />
                          <div>
                            <span className="font-bold text-slate-800 block">Bayar di Tempat (COD)</span>
                            <span className="text-xs text-slate-500">Bayar tunai saat barang tiba atau pekerjaan selesai.</span>
                          </div>
                        </div>
                        <Banknote className={`w-6 h-6 ${paymentMethod === 'cod' ? 'text-emerald-500' : 'text-slate-300'}`} />
                      </div>
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Kanan: Ringkasan Pesanan (Hanya Item Terpilih) */}
            <div className="w-full lg:w-1/3">
              <div className="bg-slate-900 rounded-3xl p-6 md:p-8 shadow-xl text-white sticky top-24">
                <h3 className="font-bold text-lg mb-6 flex items-center justify-between border-b border-slate-700 pb-4">
                  <span>Ringkasan Belanja</span>
                  <span className="text-emerald-400 text-sm">1 Item</span>
                </h3>

                {/* --- HANYA MENAMPILKAN ITEM YANG DIPILIH --- */}
                <div className="space-y-4 mb-6">
                  {activeItem ? (() => {
                    const itemQty = activeItem.qty || 1;
                    const itemDuration = activeItem.tipe === 'sewa' ? (activeItem.duration || 1) : 1;
                    const unit = activeItem.unit || 'Item';
                    
                    const itemSubtotal = activeItem.tipe === 'sewa' 
                      ? (activeItem.price * itemQty * itemDuration) 
                      : (activeItem.price * itemQty);

                    return (
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-white font-medium text-sm">{activeItem.name}</h4>
                          <p className="text-slate-400 text-xs mt-1">
                            {activeItem.tipe === 'sewa' 
                              ? `${itemQty} Unit x ${itemDuration} Hari x Rp ${activeItem.price.toLocaleString('id-ID')}` 
                              : activeItem.tipe === 'jasa'
                                ? `${itemDuration} Hari x Rp ${activeItem.price.toLocaleString('id-ID')}`
                                : `${itemQty} ${unit} x Rp ${activeItem.price.toLocaleString('id-ID')}`}
                          </p>
                        </div>
                        <p className="text-white font-medium text-sm">Rp {itemSubtotal.toLocaleString('id-ID')}</p>
                      </div>
                    );
                  })() : <p className="text-slate-400 text-xs">Belum ada item dipilih</p>}
                </div>

                {/* --- AREA RINCIAN TAGIHAN (Tanpa Kotak Total Harga Ganda di Tengah) --- */}
                <div className="space-y-3 text-sm border-t border-slate-700 pt-6 mb-6">
                  <span className="text-white font-bold block mb-3">Rincian Harga</span>
                  
                  <div className="flex justify-between text-slate-400">
                    <span>Subtotal Harga</span>
                    <span>Rp {subTotal.toLocaleString('id-ID')}</span>
                  </div>
                  
                  <div className="flex justify-between text-slate-400">
                    <span>
                      {activeItem?.tipe === 'jasa' ? 'Biaya Transportasi' : 'Ongkir Logistik Khusus'}
                    </span>
                    <span>Rp {shippingCost.toLocaleString('id-ID')}</span>
                  </div>
                  
                  <div className="flex justify-between items-center pt-4 mt-4 border-t border-slate-700">
                    <span className="text-white font-bold">Total Tagihan</span>
                    <span className="text-emerald-400 font-black text-xl">
                      Rp {total.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                <button 
                  disabled={isProcessing}
                  onClick={step === 1 ? () => document.getElementById('shipping-form').requestSubmit() : handleNextStep}
                  className={`w-full bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-black py-4 rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 ${isProcessing ? 'opacity-70 cursor-wait' : ''}`}
                >
                  <span>{isProcessing ? 'Memproses...' : (step === 1 ? 'Lanjut ke Pembayaran' : 'Bayar Sekarang')}</span>
                  {step === 1 && !isProcessing && <ArrowRight className="w-5 h-5" />}
                </button>

                <div className="mt-4 flex items-start space-x-2 text-slate-500 bg-slate-800/50 p-3 rounded-lg">
                  <Info className="w-4 h-4 shrink-0 mt-0.5" />
                  <p className="text-[10px] leading-relaxed">
                    Dengan memproses pembayaran, 100% margin keuntungan (setelah potong ongkir logistik) akan langsung masuk ke Dashboard Mitra.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
        
          /* Step 3: Halaman Sukses */
          <div className="max-w-2xl mx-auto bg-white p-10 rounded-3xl border border-slate-200/60 shadow-xl text-center animate-slide-in">
            <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-12 h-12 text-emerald-600" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 mb-4">Pembayaran Berhasil!</h1>
            <p className="text-slate-500 mb-8 leading-relaxed">
              Pesanan Anda telah diteruskan ke mitra petani/nelayan di Aceh Selatan. Anda telah berkontribusi memotong rantai tengkulak hari ini.
            </p>

            <div className="bg-slate-50 rounded-2xl p-6 mb-8 text-left border border-slate-100">
              <p className="text-xs font-bold text-slate-400 uppercase mb-4 tracking-wider border-b border-slate-200 pb-2">Detail Transaksi</p>
              <div className="grid grid-cols-2 gap-y-4 text-sm">
                <div className="text-slate-500">Kode Pesanan</div>
                <div className="font-bold text-slate-900 text-right">{finalOrderInfo?.orderId}</div>
                <div className="text-slate-500">Total Dibayar</div>
                <div className="font-bold text-emerald-600 text-right">Rp {finalOrderInfo?.totalPaid.toLocaleString('id-ID')}</div>
                <div className="text-slate-500">Metode</div>
                <div className="font-bold text-slate-900 text-right capitalize">
                  {finalOrderInfo?.method === 'escrow' ? 'Rekening Bersama' : finalOrderInfo?.method === 'transfer' ? 'Transfer Bank' : finalOrderInfo?.method === 'cod' ? 'Bayar di Tempat (COD)' : finalOrderInfo?.method}
                </div>
              </div>
            </div>

            <button 
              onClick={() => navigate('/')}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-8 rounded-xl shadow-lg transition-all"
            >
              Kembali ke Beranda
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
