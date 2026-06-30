// src/components/dashboard/OrderTable.jsx
import React from 'react';
import { Clock, Truck, CheckCircle2, MoreVertical, Search } from 'lucide-react';

export default function OrderTable() {
  // Simulasi Data Pesanan Masuk (Mock Data)
  const mockOrders = [
    {
      id: "AM-9982-XYZ",
      customer: "Muhammad Khairuddin",
      destination: "Syiah Kuala, Banda Aceh",
      product: "Ikan Tongkol Segar",
      qty: "2 Kg",
      total: 95000,
      status: "pending",
      date: "15 Jun 2026"
    },
    {
      id: "AM-9981-ABC",
      customer: "Banda Aceh Seafood Resto",
      destination: "Ulee Lheue, Banda Aceh",
      product: "Udang Vaname Premium",
      qty: "20 Kg",
      total: 1750000,
      status: "shipped",
      date: "14 Jun 2026"
    },
    {
      id: "AM-9975-DEF",
      customer: "Kedai Kopi Gayo",
      destination: "Ulee Kareng, Banda Aceh",
      product: "Kopi Gayo Arabika",
      qty: "5 Kg",
      total: 600000,
      status: "completed",
      date: "10 Jun 2026"
    }
  ];

  // Fungsi untuk me-render lencana status dengan warna dinamis
  const renderStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <span className="flex items-center space-x-1 w-max bg-amber-100 text-amber-700 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
            <Clock className="w-3 h-3" />
            <span>Perlu Dikirim</span>
          </span>
        );
      case 'shipped':
        return (
          <span className="flex items-center space-x-1 w-max bg-blue-100 text-blue-700 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
            <Truck className="w-3 h-3" />
            <span>Dalam Perjalanan</span>
          </span>
        );
      case 'completed':
        return (
          <span className="flex items-center space-x-1 w-max bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
            <CheckCircle2 className="w-3 h-3" />
            <span>Selesai</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden animate-slide-in">
      
      {/* Header Tabel & Pencarian */}
      <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-900 text-lg">Daftar Transaksi</h3>
          <p className="text-xs text-slate-500 mt-1">Kelola dan pantau pengiriman komoditas Anda ke pembeli.</p>
        </div>
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input 
            type="text" 
            placeholder="Cari ID atau nama..." 
            className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all w-full sm:w-64"
          />
        </div>
      </div>

      {/* Wrapper agar tabel bisa di-scroll secara horizontal di layar HP (Responsive) */}
      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-100">
              <th className="px-6 py-4 font-bold">ID Pesanan</th>
              <th className="px-6 py-4 font-bold">Pelanggan & Tujuan</th>
              <th className="px-6 py-4 font-bold">Komoditas (Qty)</th>
              <th className="px-6 py-4 font-bold">Total Harga</th>
              <th className="px-6 py-4 font-bold">Status</th>
              <th className="px-6 py-4 text-center font-bold">Aksi</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-slate-50">
            {mockOrders.map((order) => (
              <tr key={order.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <span className="font-mono font-bold text-slate-700">{order.id}</span>
                  <span className="block text-xs text-slate-400 mt-1">{order.date}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="font-bold text-slate-900 block">{order.customer}</span>
                  <span className="text-xs text-slate-500 truncate max-w-[150px] block mt-1">{order.destination}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-slate-800 font-medium block">{order.product}</span>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded mt-1 inline-block">
                    {order.qty}
                  </span>
                </td>
                <td className="px-6 py-4 font-black text-slate-900">
                  Rp {order.total.toLocaleString('id-ID')}
                </td>
                <td className="px-6 py-4">
                  {renderStatusBadge(order.status)}
                </td>
                <td className="px-6 py-4 text-center">
                  <button className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Footer Tabel */}
      <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
        <span>Menampilkan 3 dari 3 pesanan</span>
        <div className="flex space-x-2">
          <button className="px-3 py-1 bg-white border border-slate-200 rounded hover:bg-slate-100 disabled:opacity-50" disabled>Sebelumnya</button>
          <button className="px-3 py-1 bg-white border border-slate-200 rounded hover:bg-slate-100 disabled:opacity-50" disabled>Selanjutnya</button>
        </div>
      </div>

    </div>
  );
}
