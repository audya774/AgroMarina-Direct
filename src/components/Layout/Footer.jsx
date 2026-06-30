import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Mail, ShieldCheck, Leaf, Anchor } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-slate-200 pt-16 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Grid disesuaikan menjadi 3 kolom karena Tautan Cepat sudah dipindah ke Navbar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">

          {/* Kolom 1: Brand & Misi */}
          <div className="space-y-4 pr-4">
            <Link to="/" className="flex items-center space-x-2 group w-max">
              <div className="bg-gradient-to-tr from-emerald-500 to-blue-500 p-2 rounded-xl text-white font-black text-xl tracking-wider group-hover:scale-105 transition-transform">
                AM
              </div>
              <div>
                <span className="font-extrabold text-lg block tracking-tight text-slate-900">AgroMarina</span>
                <span className="text-[10px] text-slate-500 font-semibold block -mt-1 tracking-widest uppercase">Direct</span>
              </div>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed">
              Platform logistik digital yang memotong rantai tengkulak. Kami menghubungkan hasil bumi dan laut langsung ke tangan konsumen dengan harga adil dan pelacakan transparan.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <span className="flex items-center space-x-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Traceability</span>
              </span>
            </div>
          </div>

          {/* Kolom 2: Jelajahi Sektor */}
          <div>
            <h3 className="font-bold text-slate-900 mb-6 uppercase tracking-wider text-sm">Sektor Kami</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/marketplace" className="text-slate-500 hover:text-emerald-600 transition-colors text-sm flex items-center space-x-2 group">
                  <Leaf className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>Agro (Pertanian & Perkebunan)</span>
                </Link>
              </li>
              <li>
                <Link to="/marketplace" className="text-slate-500 hover:text-blue-600 transition-colors text-sm flex items-center space-x-2 group">
                  <Anchor className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>Marine (Perikanan & Kelautan)</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Pusat Operasional */}
          <div>
            <h3 className="font-bold text-slate-900 mb-6 uppercase tracking-wider text-sm">Rute Operasional</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 text-sm text-slate-500">
                <MapPin className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <span className="block font-bold text-slate-700">Pusat Permintaan (Konsumen)</span>
                  Kawasan Kampus USK & Sekitarnya, Banda Aceh
                </div>
              </li>
              <li className="flex items-start space-x-3 text-sm text-slate-500">
                <MapPin className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <span className="block font-bold text-slate-700">Sumber Komoditas (Mitra)</span>
                  Pesisir & Dataran Tinggi, Aceh Selatan
                </div>
              </li>
              <li className="flex items-center space-x-3 text-sm text-slate-500 pt-2">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <span>support@agromarinadirect.id</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bagian Bawah: Copyright */}
        <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-400 font-medium">
          <p>© {currentYear} AgroMarina Direct. Hak Cipta Dilindungi.</p>
          <p className="mt-2 md:mt-0 flex items-center space-x-1">
            <span>Didesain untuk</span>
            <span className="font-bold text-emerald-600 ml-1">UTU Awards Competition</span>
          </p>
        </div>

      </div>
    </footer>
  );
}

