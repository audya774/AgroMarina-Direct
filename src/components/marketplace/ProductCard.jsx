import React from 'react';
import { MapPin, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext'; // 🟢 1. Import memori keranjang

const ProductCard = ({ product, onImageClick }) => {
  // 🟢 2. Panggil fungsi untuk menambah barang
  const { addToCart } = useCart(); 
   const navigate = useNavigate();
  const isAgroSector = product.category === 'Bumi Agro' || product.category === 'Saprotan' || product.category === 'Agro Jasa' || product.category === 'Agro Sewa';

  // 🟢 3. Buat fungsi klik keranjang yang sesungguhnya
  const handleAddToCart = (e) => {
    e.stopPropagation(); // Mencegah klik menyebar ke gambar
    addToCart(product, 1); // Mengirim 1 item ke keranjang
    navigate('/cart');
    alert(`${product.name} berhasil ditambahkan ke keranjang!`);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between h-full">
      
      {/* 📸 AREA GAMBAR */}
      <div 
        onClick={() => onImageClick && onImageClick(product)} 
        className="relative h-48 bg-slate-100 cursor-pointer group"
        title="Klik untuk melihat detail & deskripsi produk"
      >
        {product.image && (
          <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        )}
        
        <div className={`absolute top-3 left-3 px-3 py-1 rounded-lg text-xs font-bold text-white shadow-sm z-10 ${isAgroSector ? 'bg-emerald-500' : 'bg-blue-500'}`}>
          {product.category}
        </div>

        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
          <span className="text-white text-sm font-bold bg-black/60 px-4 py-2 rounded-full backdrop-blur-sm border border-white/20">
            Lihat Deskripsi
          </span>
        </div>
      </div>

      {/* INFO KONTEN PRODUK */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <p className="text-[10px] text-slate-400 italic mb-2">Klik area gambar untuk membaca deskripsi</p>
          <h3 className="font-bold text-lg text-slate-800 mb-1 line-clamp-1">{product.name}</h3>
          <div className="flex items-center gap-1 text-slate-500 text-xs mb-3">
            <MapPin className="w-3 h-3" /> <span className="line-clamp-1">{product.location}</span>
          </div>
        </div>

        <div className="flex items-end justify-between mt-4 pt-4 border-t border-slate-100">
          {/* Harga */}
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Harga per {product.unit || 'Kg'}</p>
            <p className="text-xl font-black text-slate-800">Rp {Number(product.price).toLocaleString('id-ID')}</p>
          </div>
          
          {/* Informasi Stok & Tombol Keranjang */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tersedia</p>
              <p className="font-bold text-sm text-slate-700">
                {product.stock || 0} <span className="text-xs">{product.stock_unit || 'Item'}</span>
              </p>
            </div>
            
            <button 
              type="button"
              onClick={handleAddToCart} // 🟢 4. Panggil fungsi keranjang di sini
              className={`p-3 rounded-xl text-white hover:opacity-90 active:scale-95 transition-all shadow-sm ${isAgroSector ? 'bg-emerald-500' : 'bg-blue-500'}`}
            >
              <ShoppingCart className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ProductCard;
