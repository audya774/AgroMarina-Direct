
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';

const Auth = () => {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [identifier, setIdentifier] = useState(''); // Bisa diisi Email atau Nomor HP
  const [password, setPassword] = useState('');
  const [namaLengkap, setNamaLengkap] = useState(''); 

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Fungsi ajaib untuk mengubah Nomor HP menjadi Email Bayangan di balik layar
  const prosesIdentitasKeSupabase = (input) => {
    const cleanInput = input.trim();
    // Jika input hanya berisi angka, berarti pengguna memasukkan Nomor HP
    if (/^\d+$/.test(cleanInput)) {
      return `${cleanInput}@agromarina.id`; // Mengubah menjadi email sistem internal
    }
    return cleanInput; // Jika ada karakter email, biarkan tetap email asli
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    // Format identitas (Email asli atau Nomor HP yang diubah jadi email sistem)
    const emailSistem = prosesIdentitasKeSupabase(identifier);

    try {
      if (isLogin) {
        // === LOGIKA LOGIN MITRA ===
        const { data, error } = await supabase.auth.signInWithPassword({
          email: emailSistem,
          password: password,
        });

        if (error) throw error;
        navigate('/dashboard-mitra');

      } else {
        // === LOGIKA DAFTAR MITRA BARU ===
        // Cari tahu apakah dia daftar pakai nomor HP atau email untuk disimpan di profil
        const isNomorHp = /^\d+$/.test(identifier.trim());

        const { data, error } = await supabase.auth.signUp({
          email: emailSistem,
          password: password,
          options: {
            data: {
              namaLengkap: namaLengkap,
              nomorHp: isNomorHp ? identifier.trim() : '', // Simpan nomor HP asli ke metadata
              role: 'mitra',
            }
          }
        });

        if (error) throw error;

        alert("Pendaftaran lapak Mitra berhasil! Silakan masuk menggunakan akun Anda.");
        setIsLogin(true);
        setPassword('');
      }
    } catch (error) {
      console.error("Gagal Autentikasi:", error.message);
      if (error.message.includes('Invalid login credentials')) {
        setErrorMessage('Nomor HP/Email atau Kata Sandi salah.');
      } else if (error.message.includes('already registered')) {
        setErrorMessage('Nomor HP atau Email ini sudah terdaftar.');
      } else {
        setErrorMessage('Terjadi kesalahan: ' + error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4 font-sans">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-100">

        {/* Judul Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-[#1E293B]">
            {isLogin ? 'Masuk MitraPanel' : 'Daftar Lapak Mitra'}
          </h2>
          <p className="text-gray-500 mt-2 text-sm font-medium">
            {isLogin ? 'Kelola lapak hasil bumi dan laut Anda' : 'Daftar tanpa email, cukup gunakan Nomor HP Anda'}
          </p>
        </div>

        {errorMessage && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-100 text-center font-medium">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Kolom Nama Lengkap (Hanya saat Daftar) */}
          {!isLogin && (
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Nama Lengkap / Nama Lapak</label>
              <input
                type="text" required value={namaLengkap}
                onChange={(e) => setNamaLengkap(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#10B981] outline-none transition"
                placeholder="Misal: Nelayan Berkah / Pak Ahmad"
              />
            </div>
          )}

          {/* Kolom Fleksibel: Bisa Email atau Nomor HP */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Nomor HP atau Email</label>
            <input
              type="text" 
              required 
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#10B981] outline-none transition"
              placeholder="Contoh: 08123456789 atau email@contoh.com"
            />
            <p className="text-[11px] text-gray-400 mt-1 font-medium">
              *Bagi pekebun/nelayan yang tidak memiliki email, silakan langsung masukkan nomor HP aktif saja.
            </p>
          </div>

          {/* Kolom Kata Sandi */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Kata Sandi</label>
            <input
              type="password" required value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#10B981] outline-none transition"
              placeholder="Minimal 6 karakter" minLength="6"
            />
          </div>

          {/* Tombol Kirim */}
          <button
            type="submit" disabled={isLoading}
            className={`w-full py-3.5 rounded-xl text-white font-bold transition duration-200 shadow-md ${
              isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#10B981] hover:bg-[#059669]'
            }`}
          >
            {isLoading ? 'Memproses...' : (isLogin ? 'Masuk ke Dashboard' : 'Buat Akun Lapak')}
          </button>
        </form>

        <div className="mt-8 mb-4 border-t border-gray-200"></div>

        {/* Navigasi Ganti Mode */}
        <p className="text-center text-sm text-gray-600 font-medium">
          {isLogin ? "Belum punya akun lapak? " : "Sudah punya akun lapak? "}
          <button
            type="button"
            onClick={() => { setIsLogin(!isLogin); setErrorMessage(''); setIdentifier(''); }}
            className="text-[#10B981] font-bold hover:underline"
          >
            {isLogin ? 'Daftar sekarang' : 'Masuk di sini'}
          </button>
        </p>

      </div>
    </div>
  );
};

export default Auth;
