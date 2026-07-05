import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabase'; // Memanggil konfigurasi Supabase milikmu

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🟢 Fungsi Login Mitra menggunakan Supabase Auth
  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    if (error) throw error;
    return data;
  };

  // 🟢 Fungsi Logout menggunakan Supabase Auth
  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  // 🟢 Memantau status login session secara real-time dari Supabase
  useEffect(() => {
    // 1. Ambil session aktif saat pertama kali aplikasi dimuat
    supabase.auth.getSession().then(({ data: { session } }) => {
      setCurrentUser(session?.user ?? null);
      setLoading(false);
    });

    // 2. Dengarkan perubahan status auth secara real-time (login/logout/refresh token)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user ?? null);
      setLoading(false);
    });

    // Amankan memori dari kebocoran (cleanup subscription)
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const value = {
    currentUser,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {/* Mencegah aplikasi merender halaman sebelum status login selesai dicek */}
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom Hook untuk digunakan di halaman Login atau Dashboard
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth harus digunakan di dalam AuthProvider');
  }
  return context;
};
