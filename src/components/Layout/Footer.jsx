import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, ShieldCheck, Phone } from 'lucide-react'; 

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-slate-200 pt-10 pb-6 pt-10 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* items-end menjaga agar bagian bawah logo, teks, dan kontak tetap rata menempel di bawah */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-6 items-end">

          {/* KOLOM 1: Logo & Verified */}
          <div className="md:col-span-3 flex flex-col items-start gap-3">
            <Link to="/" className="group w-max">
              <img 
                src="/logo.png" 
                alt="AgroMarina Direct Logo" 
                className="h-[110px] w-auto object-contain group-hover:scale-105 transition-transform" 
              />
            </Link>
            <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Verified Traceability</span>
            </div>
          </div>

          {/* KOLOM 2: Deskripsi (Tengah) */}
          <div className="md:col-span-6 flex items-center justify-center pb-2 md:pl-1">
            {/* 🟢 max-w-xl membuat teks lebih lebar sehingga pas terbagi menjadi 3 baris */}
            <p className="text-slate-500 text-sm leading-snug text-center max-w-xl">
              Ekosistem digital terintegrasi yang memotong rantai pasok konvensional. Kami menghubungkan hasil panen, tangkapan laut, layanan jasa, sewa alat, hingga sarana produksi (Saprotan & Sapronel) langsung dari mitra ke tangan Anda secara adil dan transparan.
            </p>
          </div>

          {/* KOLOM 3: Hubungi Kami (Kanan) */}
          <div className="md:col-span-3 flex md:justify-end pb-2">
            <div className="w-full">
              <h3 className="font-bold text-slate-900 mb-4 uppercase tracking-wider text-sm">Hubungi Kami</h3>
              <ul className="space-y-3">
                <li>
                  <a href="tel:+6281361293319" className="text-slate-500 hover:text-emerald-600 transition-colors text-sm flex items-center space-x-2">
                    <Phone className="w-4 h-4 shrink-0 text-slate-400" />
                    <span>+62 813-6129-3319</span>
                  </a>
                </li>
                <li>
                  <a href="mailto:support@agromarinadirect.id" className="text-slate-500 hover:text-emerald-600 transition-colors text-sm flex items-center space-x-2">
                    <Mail className="w-4 h-4 shrink-0 text-slate-400" />
                    <span>support@agromarinadirect.id</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

        </div>

        {/* Bagian Bawah: Copyright */}
        <div className="border-t border-slate-100 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-slate-400 font-medium">
          <p>© {currentYear} AgroMarina Direct. Hak Cipta Dilindungi.</p>
          <p className="mt-2 md:mt-0 flex items-center space-x-1">
            <span>Platform Untuk</span>
            <span className="font-bold text-emerald-600 ml-1">Mitra dan Pelanggan</span>
          </p>
        </div>

      </div>
    </footer>
  );
}
