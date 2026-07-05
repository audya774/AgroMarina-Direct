import React from 'react';
import { MapPin, ShoppingCart } from 'lucide-react';

const ProductCard = ({ product, onImageClick }) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
      
      {/* 📸 AREA GAMBAR - Memicu Modal Detail & Ulasan saat Diklik */}
      <div 
        onClick={() => onImageClick && onImageClick(product)} 
        className="relative h-48 bg-slate-100 cursor-pointer hover:opacity-95 transition-opacity"
        title="Klik untuk melihat detail & ulasan produk"
      >
        {product.image && (
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        )}
        <div className={`absolute top-3 left-3 px-3 py-1 rounded-lg text-xs font-bold text-white ${product.category === 'agro' ? 'bg-emerald-500' : 'bg-blue-500'}`}>
          {product.category.toUpperCase()}
        </div>
      </div>

      {/* INFO KONTEN PRODUK (NAMA, LOKASI, HARGA) */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-lg text-slate-800 mb-1 line-clamp-1">{product.name}</h3>
          <div className="flex items-center gap-1 text-slate-500 text-xs mb-3">
            <MapPin className="w-3 h-3" /> <span className="line-clamp-1">{product.location}</span>
          </div>
        </div>

        <div className="flex items-end justify-between mt-4 pt-4 border-t border-slate-100">
          <div>
            <p className="text-[10px] font-bold text-slate-400">Harga per {product.unit || 'Kg'}</p>
            <p className="text-xl font-black text-slate-800">Rp {Number(product.price).toLocaleString('id-ID')}</p>
          </div>
          <button 
            type="button"
            className={`p-3 rounded-xl text-white hover:opacity-90 transition-opacity ${product.category === 'agro' ? 'bg-emerald-500' : 'bg-blue-500'}`}
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>

    </div>
  );
};

export default ProductCard;
