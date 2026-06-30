import React, { useState } from 'react';
import { 
  MapPin, 
  Clock, 
  ShieldCheck, 
  ChevronRight, 
  Anchor, 
  Leaf, 
  ShoppingCart,
  Minus,
  Plus
} from 'lucide-react';

export default function ProductDetail() {
  // Mock Data: Nantinya ini didapatkan dari URL parameter atau Firebase (api.js)
  const product = {
    id: 1,
    name: "Ikan Tongkol Segar Tangkapan Pagi",
    category: "Marine",
    price: 35000,
    unit: "kg",
    stock: 25,
    origin: "Perairan Pesisir Aceh Selatan",
    farmerName: "Kelompok Nelayan Harapan Laut",
    harvestTime: "Hari ini, 05:30 WIB",
    description: "Ikan tongkol segar hasil tangkapan nelayan lokal langsung dari perairan Aceh Selatan. Tanpa pengawet, ditangkap menggunakan metode ramah lingkungan (pancing ulur), dan langsung masuk kotak pendingin (cold storage) di atas kapal.",
    image: "https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?w=800&auto=format&fit=crop&q=80"
  };

  const [qty, setQty] = useState(1);

  const handleDecrease = () => {
    if (qty > 1) setQty(qty - 1);
  };

  const handleIncrease = () => {
    if (qty < product.stock) setQty(qty + 1);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 md:px-8 lg:px-16">
      
      {/* Breadcrumbs Navigation */}
      <nav className="flex items-center text-sm text-slate-500 mb-8 space-x-2">
        <span className="hover:text-emerald-600 cursor-pointer">Home</span>
        <ChevronRight className="w-4 h-4" />
        <span className="hover:text-emerald-600 cursor-pointer">Marketplace</span>
        <ChevronRight className="w-4 h-4" />
        <span className="text-slate-900 font-semibold">{product.name}</span>
      </nav>

      {/* Main Content Grid */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          
          {/* Left Column: Image Area */}
          <div className="relative h-[400px] md:h-full min-h-[500px] bg-slate-100">
            <img 
              src={product.image} 
              alt={product.name} 
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Category Badge */}
            <div className={`absolute top-6 left-6 px-4 py-1.5 rounded-full text-sm font-bold text-white shadow-lg flex items-center space-x-2 
              ${product.category === 'Agro' ? 'bg-emerald-600' : 'bg-blue-600'}`}>
              {product.category === 'Agro' ? <Leaf className="w-4 h-4" /> : <Anchor className="w-4 h-4" />}
              <span>{product.category}</span>
            </div>
          </div>

          {/* Right Column: Product Details */}
          <div className="p-8 lg:p-12 flex flex-col justify-center">
            
            <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight mb-4">
              {product.name}
            </h1>
            
            <div className="flex items-end space-x-2 mb-6">
              <span className="text-4xl font-black text-slate-900">
                Rp {product.price.toLocaleString('id-ID')}
              </span>
              <span className="text-lg text-slate-500 font-medium mb-1">/{product.unit}</span>
            </div>

            {/* SEKSI TRACEABILITY (Nilai Jual Utama) */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 mb-8 space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center space-x-1">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Sertifikasi Traceability Lokal</span>
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 p-2 rounded-lg text-blue-600 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Lokasi Asal</p>
                    <p className="text-sm font-semibold text-slate-800">{product.origin}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{product.farmerName}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-amber-100 p-2 rounded-lg text-amber-600 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Waktu Panen/Tangkap</p>
                    <p className="text-sm font-semibold text-slate-800">{product.harvestTime}</p>
                    <p className="text-xs text-emerald-600 font-medium mt-0.5">Kualitas Segar Terjamin</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-sm font-bold text-slate-900 mb-2">Deskripsi Produk</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Action Area (Add to Cart) */}
            <div className="flex items-center space-x-4 mt-auto">
              {/* Quantity Selector */}
              <div className="flex items-center bg-slate-100 rounded-xl border border-slate-200">
                <button onClick={handleDecrease} className="p-3 text-slate-500 hover:text-slate-900 transition-colors">
                  <Minus className="w-5 h-5" />
                </button>
                <span className="w-12 text-center font-bold text-slate-900">{qty}</span>
                <button onClick={handleIncrease} className="p-3 text-slate-500 hover:text-slate-900 transition-colors">
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              {/* Add to Cart Button */}
              <button className={`flex-1 flex items-center justify-center space-x-2 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5
                ${product.category === 'Agro' ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/30'}`}>
                <ShoppingCart className="w-5 h-5" />
                <span>Tambah ke Keranjang</span>
              </button>
            </div>

            <p className="text-center text-xs text-slate-400 mt-4">
              Sisa stok tersedia: <span className="font-bold text-slate-600">{product.stock} {product.unit}</span>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}
