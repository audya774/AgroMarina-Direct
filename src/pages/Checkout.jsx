import React, { useState } from 'react';
import { 
  MapPin, 
  Truck, 
  CreditCard, 
  ShieldCheck, 
  CheckCircle2, 
  Wallet, 
  ArrowRight,
  Info
} from 'lucide-react';

export default function Checkout() {
  const [step, setStep] = useState(1); // 1: Pengiriman, 2: Pembayaran, 3: Sukses
  const [paymentMethod, setPaymentMethod] = useState('escrow');

  // Simulasi Data Keranjang
  const mockCart = [
    { id: 1, name: "Ikan Tongkol Segar", qty: 2, price: 35000, category: 'Marine' },
    { id: 3, name: "Kopi Gayo Arabika", qty: 1, price: 120000, category: 'Agro' }
  ];

  const subTotal = mockCart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const shippingCost = 25000; // Subsidi ongkir logistik langsung
  const total = subTotal + shippingCost;

  const handleNextStep = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setStep(step + 1);
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-8 pb-20 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Progress Tracker */}
        <div className="flex items-center justify-center mb-10">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${step >= 1 ? 'bg-emerald-600 text-white shadow-lg' : 'bg-slate-200 text-slate-500'}`}>1</div>
            <div className={`w-12 h-1 rounded-full ${step >= 2 ? 'bg-emerald-600' : 'bg-slate-200'}`}></div>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${step >= 2 ? 'bg-emerald-600 text-white shadow-lg' : 'bg-slate-200 text-slate-500'}`}>2</div>
            <div className={`w-12 h-1 rounded-full ${step >= 3 ? 'bg-emerald-600' : 'bg-slate-200'}`}></div>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${step >= 3 ? 'bg-emerald-600 text-white shadow-lg' : 'bg-slate-200 text-slate-500'}`}>3</div>
          </div>
        </div>

        {step < 3 ? (
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Kiri: Form Input */}
            <div className="w-full lg:w-2/3 space-y-6">
              
              {step === 1 && (
                <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/60 shadow-sm animate-slide-in">
                  <div className="flex items-center space-x-3 mb-6 border-b border-slate-100 pb-4">
                    <div className="p-2 bg-blue-100 rounded-xl text-blue-600"><MapPin className="w-5 h-5" /></div>
                    <h2 className="text-xl font-bold text-slate-900">Informasi Pengiriman</h2>
                  </div>

                  {/* Highlight Rute Logistik (Nilai Jual Juri) */}
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
                        <input type="text" required defaultValue="Muhammad Khairuddin" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none bg-slate-50" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Nomor HP / WhatsApp</label>
                        <input type="tel" required defaultValue="081234567890" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none bg-slate-50" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Alamat Lengkap Tujuan</label>
                      <textarea required rows="3" defaultValue="Jl. Teuku Nyak Arief, Darussalam, Kec. Syiah Kuala, Kota Banda Aceh" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none bg-slate-50"></textarea>
                    </div>
                  </form>
                </div>
              )}

              {step === 2 && (
                <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/60 shadow-sm animate-slide-in">
                  <div className="flex items-center space-x-3 mb-6 border-b border-slate-100 pb-4">
                    <div className="p-2 bg-amber-100 rounded-xl text-amber-600"><CreditCard className="w-5 h-5" /></div>
                    <h2 className="text-xl font-bold text-slate-900">Metode Pembayaran</h2>
                  </div>

                  <div className="space-y-4">
                    {/* Metode 1: Escrow (Sangat direkomendasikan untuk marketplace) */}
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

                    {/* Metode 2: Transfer Bank */}
                    <label className={`block p-4 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'transfer' ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-100 hover:border-slate-200 bg-white'}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <input type="radio" name="payment" value="transfer" checked={paymentMethod === 'transfer'} onChange={() => setPaymentMethod('transfer')} className="w-5 h-5 text-emerald-600 focus:ring-emerald-500" />
                          <div>
                            <span className="font-bold text-slate-800 block">Transfer Bank (Virtual Account)</span>
                            <span className="text-xs text-slate-500">BSI, Mandiri, BCA, BRI. Verifikasi otomatis.</span>
                          </div>
                        </div>
                        <CreditCard className={`w-6 h-6 ${paymentMethod === 'transfer' ? 'text-emerald-500' : 'text-slate-300'}`} />
                      </div>
                    </label>

                    {/* Metode 3: E-Wallet */}
                    <label className={`block p-4 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'ewallet' ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-100 hover:border-slate-200 bg-white'}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <input type="radio" name="payment" value="ewallet" checked={paymentMethod === 'ewallet'} onChange={() => setPaymentMethod('ewallet')} className="w-5 h-5 text-emerald-600 focus:ring-emerald-500" />
                          <div>
                            <span className="font-bold text-slate-800 block">E-Wallet (QRIS)</span>
                            <span className="text-xs text-slate-500">GoPay, OVO, Dana, LinkAja.</span>
                          </div>
                        </div>
                        <Wallet className={`w-6 h-6 ${paymentMethod === 'ewallet' ? 'text-emerald-500' : 'text-slate-300'}`} />
                      </div>
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Kanan: Ringkasan Pesanan (Order Summary) */}
            <div className="w-full lg:w-1/3">
              <div className="bg-slate-900 rounded-3xl p-6 md:p-8 shadow-xl text-white sticky top-24">
                <h3 className="font-bold text-lg mb-6 flex items-center justify-between border-b border-slate-700 pb-4">
                  <span>Ringkasan Belanja</span>
                  <span className="text-emerald-400 text-sm">{mockCart.length} Item</span>
                </h3>

                <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto no-scrollbar pr-2">
                  {mockCart.map(item => (
                    <div key={item.id} className="flex justify-between items-start text-sm">
                      <div className="flex-1 pr-4">
                        <p className="font-semibold text-slate-200 line-clamp-1">{item.name}</p>
                        <p className="text-slate-500 mt-0.5">{item.qty} x Rp {item.price.toLocaleString('id-ID')}</p>
                      </div>
                      <span className="font-bold text-slate-300 whitespace-nowrap">
                        Rp {(item.qty * item.price).toLocaleString('id-ID')}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-700 pt-4 space-y-3 mb-6 text-sm">
                  <div className="flex justify-between text-slate-400">
                    <span>Subtotal Harga</span>
                    <span>Rp {subTotal.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Ongkir Logistik Khusus</span>
                    <span>Rp {shippingCost.toLocaleString('id-ID')}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-8 border-t border-slate-700 pt-4">
                  <span className="font-bold text-slate-300">Total Tagihan</span>
                  <span className="font-black text-2xl text-emerald-400">Rp {total.toLocaleString('id-ID')}</span>
                </div>

                <button 
                  onClick={step === 1 ? () => document.getElementById('shipping-form').requestSubmit() : handleNextStep}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-black py-4 rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2"
                >
                  <span>{step === 1 ? 'Lanjut ke Pembayaran' : 'Bayar Sekarang'}</span>
                  {step === 1 && <ArrowRight className="w-5 h-5" />}
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
                <div className="font-bold text-slate-900 text-right">#AM-9982-XYZ</div>
                <div className="text-slate-500">Total Dibayar</div>
                <div className="font-bold text-emerald-600 text-right">Rp {total.toLocaleString('id-ID')}</div>
                <div className="text-slate-500">Metode</div>
                <div className="font-bold text-slate-900 text-right capitalize">{paymentMethod === 'escrow' ? 'Rekening Bersama' : paymentMethod}</div>
              </div>
            </div>

            <button 
              onClick={() => window.location.href = '/'}
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
