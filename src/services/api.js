// src/services/api.js
import { db } from "../firebase";
import { 
  collection, 
  getDocs, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot 
} from "firebase/firestore";

/**
 * 1. AMBIL SEMUA PRODUK (MAKETPLACE)
 * Mengambil seluruh data komoditas pertanian dan kelautan yang tersedia.
 */
export const fetchProducts = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "products"));
    const products = [];
    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() });
    });
    return products;
  } catch (error) {
    console.error("Error fetching products: ", error);
    throw error;
  }
};

/**
 * 2. TAMBAH PRODUK BARU (DASHBOARD MITRA)
 * Digunakan oleh petani atau nelayan untuk memasukkan hasil panen/tangkapan mereka.
 * Menyertakan data lokasi dan waktu untuk fitur TRACEABILITY.
 */
export const addProduct = async (productData) => {
  try {
    // Struktur data otomatis menyertakan timestamp pembuatan
    const docRef = await addDoc(collection(db, "products"), {
      ...productData,
      createdAt: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding product: ", error);
    throw error;
  }
};

/**
 * 3. REAL-TIME MARKET TICKER (STREAM DATA)
 * Menggunakan onSnapshot agar harga pasar bergerak secara otomatis (real-time)
 * ketika ada perubahan data di database Firebase tanpa perlu me-refresh halaman.
 */
export const subscribeToMarketPrices = (callback) => {
  const q = query(collection(db, "market_prices"), orderBy("commodityName", "asc"));
  
  return onSnapshot(q, (snapshot) => {
    const prices = [];
    snapshot.forEach((doc) => {
      prices.push({ id: doc.id, ...doc.data() });
    });
    callback(prices);
  }, (error) => {
    console.error("Error streaming market prices: ", error);
  });
};
