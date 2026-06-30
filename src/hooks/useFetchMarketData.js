// src/hooks/useFetchMarketData.js
import { useState, useEffect } from 'react';
import { subscribeToMarketPrices } from '../services/api';

export const useFetchMarketData = () => {
  const [marketData, setMarketData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // onSnapshot di dalam subscribeToMarketPrices akan terus mendengarkan 
    // pergerakan harga secara live dari server.
    const unsubscribe = subscribeToMarketPrices((livePrices) => {
      setMarketData(livePrices);
      setLoading(false);
    });

    // Cleanup function: Memutuskan koneksi saat komponen tidak digunakan 
    // agar memori dan kuota pembacaan database tetap hemat.
    return () => unsubscribe();
  }, []);

  return { marketData, loading };
};
