// src/components/ui/LoadingSpinner.jsx
import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ 
  fullScreen = false, 
  text = "Memuat data...", 
  size = "w-10 h-10" 
}) {
  
  const spinnerContent = (
    <div className="flex flex-col items-center justify-center space-y-4">
      {/* Ikon berputar dengan gradien warna AgroMarina */}
      <div className="relative">
        <div className="absolute inset-0 rounded-full blur-sm bg-emerald-400/30 animate-pulse"></div>
        <Loader2 className={`${size} text-emerald-600 animate-spin relative z-10`} />
      </div>
      
      {/* Teks opsional dengan animasi kedip pelan */}
      {text && (
        <p className="text-sm font-bold text-slate-500 tracking-wide animate-pulse">
          {text}
        </p>
      )}
    </div>
  );

  // Jika dipanggil dengan properti fullScreen={true}, spinner akan menutupi seluruh layar
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/90 backdrop-blur-sm z-[100] flex items-center justify-center">
        {spinnerContent}
      </div>
    );
  }

  // Jika tidak, spinner hanya akan mengisi ruang di dalam wadahnya (container)
  return (
    <div className="flex items-center justify-center p-12 w-full">
      {spinnerContent}
    </div>
  );
}
