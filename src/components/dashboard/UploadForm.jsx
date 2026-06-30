import React, { useState } from 'react';
import { supabase } from '../../services/supabase';
import { Upload, ImageIcon } from 'lucide-react';

export default function UploadForm() {
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [displayPrice, setDisplayPrice] = useState(''); // Untuk tampilan format (10.000)
  const [formData, setFormData] = useState({
    name: '',
    category: 'agro',
    price: '', // Ini nanti berisi angka murni (10000)
    unit: 'Kg',
    location: '',
  });

  const handleCategoryChange = (e) => {
    setFormData({ ...formData, category: e.target.value, unit: 'Kg' });
  };

  // Fungsi untuk memformat harga saat diketik
  const handlePriceChange = (e) => {
    const rawValue = e.target.value.replace(/\D/g, ''); // Hapus semua selain angka
    if (rawValue === '') {
      setDisplayPrice('');
      setFormData({ ...formData, price: '' });
      return;
    }
    // Format menjadi 10.000
    const formatted = new Intl.NumberFormat('id-ID').format(rawValue);
    setDisplayPrice(formatted);
    setFormData({ ...formData, price: rawValue }); // Simpan angka murni (10000)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) { alert('Mohon pilih foto produk!'); return; }
    
    setLoading(true);

    try {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('Hasil-images')
        .upload(fileName, imageFile);

      if (uploadError) throw new Error('Gagal upload gambar: ' + uploadError.message);

      const { data: urlData } = supabase.storage
        .from('Hasil-images')
        .getPublicUrl(fileName);

      const { error: dbError } = await supabase.from('Hasil').insert([
        {
          name: formData.name,
          category: formData.category,
          price: parseInt(formData.price, 10), // Pastikan angka murni
          unit: formData.unit,
          location: formData.location,
          image: urlData.publicUrl
        }
      ]);

      if (dbError) throw new Error('Gagal menyimpan ke database: ' + dbError.message);

      alert('Berhasil diunggah!');
      
      // Reset Form
      setFormData({ name: '', category: 'agro', price: '', unit: 'Kg', location: '' });
      setDisplayPrice('');
      setImageFile(null);
      document.getElementById('file-upload').value = '';

    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
      <h2 className="text-xl font-black mb-6 text-slate-800">Tambah Hasil Baru</h2>
      <div className="space-y-4">
        <input required placeholder="Nama Produk" className="w-full p-3 bg-slate-50 rounded-xl outline-none" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
        
        <select className="w-full p-3 bg-slate-50 rounded-xl outline-none" value={formData.category} onChange={handleCategoryChange}>
          <option value="agro">Agro 🌱</option>
          <option value="marine">Marine 🐟</option>
        </select>

        {/* Input Harga Cantik */}
        <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
          <span className="font-bold text-slate-400">Rp</span>
          <input required type="text" placeholder="0" className="w-full bg-transparent outline-none" value={displayPrice} onChange={handlePriceChange} />
          <select className="bg-transparent outline-none text-sm font-bold" value={formData.unit} onChange={(e) => setFormData({...formData, unit: e.target.value})}>
            {formData.category === 'agro' ? (
              <><option value="Kg">/Kg</option><option value="Liter">/Liter</option><option value="Ikat">/Ikat</option></>
            ) : (
              <><option value="Kg">/Kg</option><option value="Ekor">/Ekor</option></>
            )}
          </select>
        </div>

        <input required placeholder="Lokasi (Contoh: Aceh Selatan)" className="w-full p-3 bg-slate-50 rounded-xl outline-none" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} />
        
        <div className="p-3 bg-slate-50 rounded-xl border border-dashed border-slate-300">
          <input id="file-upload" required type="file" accept="image/*" className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 cursor-pointer" onChange={(e) => setImageFile(e.target.files[0])} />
        </div>

        <button disabled={loading} type="submit" className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold">
          {loading ? 'Mengupload...' : 'Upload Produk'}
        </button>
      </div>
    </form>
  );
}

