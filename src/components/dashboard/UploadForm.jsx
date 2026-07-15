import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import { Upload, ImageIcon } from 'lucide-react';

// 🛠️ MAPPING: Hanya perlu 1 ini saja untuk Harga dan Stok
const unitMapping = {
  'Bumi Agro': ['Kg', 'Liter', 'Ikat', 'Butir'],
  'Saprotan': ['Liter', 'Kg', 'Botol', 'Pcs'],
  'Marine Harvest': ['Kg', 'Ekor', 'Box'],
  'Sapronel': ['Meter', 'Pcs', 'Set'],
  'Agro Jasa': ['Hari', 'Layanan', 'Jam'],
  'Marine Jasa': ['Hari', 'Layanan', 'Jam'],
  'Agro Sewa': ['Hari', 'Jam', 'Musim'],
  'Marine Sewa': ['Hari', 'Jam', 'Musim'],
};

export default function UploadForm() {
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [displayPrice, setDisplayPrice] = useState(''); 
  
  const [tipe, setTipe] = useState(''); 
  const [subKategoriOptions, setSubKategoriOptions] = useState([]);
  
  const [formData, setFormData] = useState({
    name: '',
    category: '', 
    price: '', 
    unit: 'Kg',
    location: '',
    description: '',
    stock: '',
  });

  // Effect untuk mengatur opsi Sub-kategori dan reset data saat Tipe berubah
  useEffect(() => {
    if (tipe === 'pasar') {
      setSubKategoriOptions([
        { val: 'Bumi Agro', label: 'Bumi Agro 🌱' },
        { val: 'Saprotan', label: 'Saprotan 📦' },
        { val: 'Marine Harvest', label: 'Marine Harvest 🐟' },
        { val: 'Sapronel', label: 'Sapronel ⚓' }
      ]);
    } else if (tipe === 'jasa') {
      setSubKategoriOptions([
        { val: 'Agro Jasa', label: 'Agro Jasa 🧑🏻‍🌾' },
        { val: 'Marine Jasa', label: 'Marine Jasa ⛵' }
      ]);
    } else if (tipe === 'sewa') {
      setSubKategoriOptions([
        { val: 'Agro Sewa', label: 'Agro Sewa 🚜' },
        { val: 'Marine Sewa', label: 'Marine Sewa 🎣' }
      ]);
    } else {
      setSubKategoriOptions([]);
    }
    
    setFormData(prev => ({ ...prev, category: '', unit: 'Kg', stock: '' }));
  }, [tipe]);

  // 🛠️ Effect untuk mengubah Satuan Harga secara OTOMATIS saat Kategori dipilih
  useEffect(() => {
    if (formData.category) {
      setFormData(prev => ({ 
        ...prev, 
        unit: unitMapping[formData.category] ? unitMapping[formData.category][0] : 'Kg'
      }));
    }
  }, [formData.category]);

  const handlePriceChange = (e) => {
    const rawValue = e.target.value.replace(/\D/g, ''); 
    if (rawValue === '') {
      setDisplayPrice('');
      setFormData({ ...formData, price: '' });
      return;
    }
    const formatted = new Intl.NumberFormat('id-ID').format(rawValue);
    setDisplayPrice(formatted);
    setFormData({ ...formData, price: rawValue }); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) { alert('Mohon pilih foto produk!'); return; }
    if (!formData.category) { alert('Mohon pilih sub-kategori!'); return; }
    
    setLoading(true);

    try {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('Lapak-images')
        .upload(fileName, imageFile);

      if (uploadError) throw new Error('Gagal upload gambar: ' + uploadError.message);

      const { data: urlData } = supabase.storage
        .from('Lapak-images')
        .getPublicUrl(fileName);

         // Ganti bagian object insert menjadi seperti ini:
        const { error: dbError } = await supabase.from('Lapak').insert([
         {
           name: formData.name,
            tipe: tipe, 
            category: formData.category,
            price: parseInt(formData.price, 10), 
            unit: formData.unit,
            location: formData.location,
            description: formData.description,
            // Jika Jasa, stok akan bernilai null agar tidak tersimpan sebagai 0
            stock: tipe === 'jasa' ? null : parseInt(formData.stock, 10),
            stock_unit: tipe === 'jasa' ? null : formData.unit,
            image: urlData.publicUrl
          }
        ]);


      if (dbError) throw new Error('Gagal menyimpan ke database: ' + dbError.message);

      alert('Berhasil diunggah!');
      
      setFormData({ name: '', category: '', price: '', unit: 'Kg', location: '', description: '', stock: '' });
      setTipe(''); 
      setDisplayPrice('');
      setImageFile(null);
      document.getElementById('file-upload').value = '';

    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  // 🛠️ Fungsi untuk menentukan teks bayangan (placeholder) input Stok
  const getStockPlaceholder = () => {
    if (tipe === 'jasa') return "Kuota / Slot Layanan";
    if (tipe === 'sewa') return "Unit Tersedia";
    return "Jumlah Stok Tersedia"; // Default untuk Pasar
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
      <h2 className="text-xl font-black mb-6 text-slate-800">Tambah Lapak Baru </h2>
      <div className="space-y-4">
        
        <input required placeholder="Nama Produk/Jasa/Sewa" className="w-full p-3 bg-slate-50 rounded-xl outline-none font-medium" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
        
        <textarea required placeholder="Deskripsi (Misal: Kondisi barang, detail jasa)" className="w-full p-3 bg-slate-50 rounded-xl outline-none font-medium" rows="3" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
        
        {/* Input Tipe */}
        <select
          required
          value={tipe} 
          onChange={(e) => setTipe(e.target.value)}
          className={`w-full p-3 bg-slate-50 rounded-xl outline-none font-bold cursor-pointer ${tipe ? 'text-slate-700' : 'text-slate-400'}`}
        >
          <option value="" disabled>Pilih Tipe</option>
          <option value="pasar">Pasar</option>
          <option value="jasa">Jasa</option>
          <option value="sewa">Sewa</option>
        </select>

        {/* Input Sub-Kategori */}
        <select
          required
          disabled={!tipe}
          value={formData.category} 
          onChange={(e) => setFormData({...formData, category: e.target.value})}
          className={`w-full p-3 bg-slate-50 rounded-xl outline-none font-bold cursor-pointer ${formData.category ? 'text-slate-700' : 'text-slate-400'} ${!tipe ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
          <option value="" disabled>{!tipe ? 'Pilih Tipe Dahulu' : 'Pilih Sub-Kategori'}</option>
          {subKategoriOptions.map(opt => <option key={opt.val} value={opt.val}>{opt.label}</option>)}
        </select>

        {/* 🛠️ Input Harga dengan Dropdown Satuan */}
        <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
          <span className="font-bold text-slate-400">Rp</span>
          <input required type="text" placeholder="0" className="w-full bg-transparent outline-none font-medium" value={displayPrice} onChange={handlePriceChange} />
          <select 
            className="bg-transparent outline-none text-sm font-bold cursor-pointer" 
            value={formData.unit} 
            onChange={(e) => setFormData({...formData, unit: e.target.value})}
          >
            {formData.category && unitMapping[formData.category] ? (
              unitMapping[formData.category].map((unit) => (
                <option key={unit} value={unit}>/{unit}</option>
              ))
            ) : (
              <option value="Kg">/Kg</option>
            )}
          </select>
        </div>

        {/* 🟢 KOLOM STOK HANYA MUNCUL JIKA BUKAN JASA */}
        {tipe !== 'jasa' && (
          <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <input 
              required={tipe !== 'jasa'} 
              type="number" 
              placeholder={getStockPlaceholder()} 
              className="w-full bg-transparent outline-none font-medium" 
              value={formData.stock} 
              onChange={(e) => setFormData({...formData, stock: e.target.value})} 
            />
            <span className="text-sm font-bold text-slate-500 border-l border-slate-300 pl-3 ml-1 whitespace-nowrap">
              {formData.unit}
            </span>
          </div>
        )}

        <input required placeholder="Lokasi (Contoh: Trumon, Aceh Selatan)" className="w-full p-3 bg-slate-50 rounded-xl outline-none font-medium" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} />
        
        <div className="p-3 bg-slate-50 rounded-xl border border-dashed border-slate-300">
          <input id="file-upload" required type="file" accept="image/*" className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 cursor-pointer" onChange={(e) => setImageFile(e.target.files[0])} />
        </div>

        <button disabled={loading} type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-95 transition-all text-white py-3 rounded-xl font-bold shadow-sm">
          {loading ? 'Mengupload...' : 'Upload Produk'}
        </button>
      </div>
    </form>
  );
}
