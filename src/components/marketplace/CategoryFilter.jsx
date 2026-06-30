// src/components/marketplace/CategoryFilter.jsx
import React from 'react';
import { Leaf, Waves, LayoutGrid } from 'lucide-react';

export default function CategoryFilter({ activeCategory, setActiveCategory }) {
  // Array data kategori agar lebih mudah di-render (DRY principle)
  const categories = [
    { 
      id: 'All', 
      label: 'Semua Komoditas', 
      icon: <LayoutGrid className="w-4 h-4" /> 
    },
    { 
      id: 'Agro', 
      label: 'Agro (Tani)', 
      icon: <Leaf className="w-4 h-4" /> 
    },
    { 
      id: 'Marine', 
      label: 'Marine (Laut)', 
      icon: <Waves className="w-4 h-4" /> 
    }
  ];

  return (
    <div className="flex items-center space-x-3 overflow-x-auto pb-2 no-scrollbar">
      {categories.map((cat) => {
        const isActive = activeCategory === cat.id;
        
        // Kustomisasi warna dinamis berdasarkan kategori yang aktif
        let activeStyles = "bg-slate-900 text-white shadow-md scale-105 border-transparent";
        if (isActive && cat.id === 'Agro') {
          activeStyles = "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 scale-105 border-transparent";
        } else if (isActive && cat.id === 'Marine') {
          activeStyles = "bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-105 border-transparent";
        }

        return (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 whitespace-nowrap border ${
              isActive 
                ? activeStyles 
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
            }`}
          >
            {/* Animasi ringan pada ikon saat tombol di-hover */}
            <span className={`${isActive ? 'animate-bounce' : 'group-hover:scale-110'} transition-transform`}>
              {cat.icon}
            </span>
            <span>{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
}
