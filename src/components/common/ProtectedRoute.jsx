import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../../services/supabase';

export default function ProtectedRoute({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mengecek status login user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });
  }, []);

  // Menunggu pengecekan selesai agar user tidak langsung di-redirect
  if (loading) return <div>Memuat...</div>;

  // Jika tidak ada session, arahkan ke halaman Auth
  if (!session) return <Navigate to="/auth" replace />;

  // Jika ada session, tampilkan konten dashboard
  return children;
}
