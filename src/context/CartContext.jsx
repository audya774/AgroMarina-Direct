// src/context/CartContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
   const syncCartWithLatestData = (latestProducts) => {
  setCart((prevCart) => {
    return prevCart.map(cartItem => {
      // Cari produk asli di database/pasar berdasarkan ID
      const realProduct = latestProducts.find(p => p.id === cartItem.id);
      
      // Jika produk masih ada di pasar, perbarui stok (dan harganya jika perlu)
      if (realProduct) {
        return { 
          ...cartItem, 
          stock: realProduct.stock, // 🟢 Update stok terbaru
          price: realProduct.price  // 🟢 Update harga terbaru (opsional)
        };
      }
      return cartItem;
    });
  });
};
  // 🟢 1. Modifikasi: Ambil data dari memori browser saat aplikasi pertama kali dimuat
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('agromarina_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // 🟢 2. Tambahan: Otomatis simpan ke memori browser setiap kali isi keranjang berubah
  useEffect(() => {
    localStorage.setItem('agromarina_cart', JSON.stringify(cart));
  }, [cart]);
  
  // 1. Tambah Produk ke Keranjang
  const addToCart = (product, quantity = 1) => {
    setCart((prevCart) => {
      // Menggunakan id atau name sebagai pengenal unik
      const existingItem = prevCart.find((item) => (item.id || item.name) === (product.id || product.name));
      if (existingItem) {
        return prevCart.map((item) =>
          (item.id || item.name) === (product.id || product.name) 
            ? { ...item, qty: item.qty + quantity } 
            : item
        );
      }
      return [...prevCart, { ...product, qty: quantity }];
    });
  };

  // 2. Hapus Produk dari Keranjang
  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => (item.id || item.name) !== id));
  };

  // 3. Ubah Kuantitas Langsung
  const updateQuantity = (id, newQty) => {
    if (newQty <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) => ((item.id || item.name) === id ? { ...item, qty: newQty } : item))
    );
  };

  // 4. Kosongkan Keranjang (Dipanggil setelah Checkout sukses)
  const clearCart = () => setCart([]);

  // Kuantitas total item dan subtotal harga otomatis dihitung di sini
  const subTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  
    // 5. Fungsi Sinkronisasi dengan Database
  const syncWithDatabase = (latestProducts) => {
    setCart((prevCart) => {
      let isUpdated = false;
      
      const newCart = prevCart.map(cartItem => {
        // Cari data terbaru dari Supabase berdasarkan ID
        const freshData = latestProducts.find(p => p.id === cartItem.id);
        
        if (freshData) {
          // Jika stok berubah atau harga berubah, kita update datanya
          if (cartItem.stock !== freshData.stock || cartItem.price !== freshData.price) {
            isUpdated = true;
            return { 
              ...cartItem, 
              stock: freshData.stock, 
              price: freshData.price 
            };
          }
        }
        return cartItem;
      });

      // Hanya update state jika memang ada perubahan (menghindari render berulang)
      return isUpdated ? newCart : prevCart;
    });
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom Hook agar pemanggilan di komponen lain jauh lebih simpel
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart harus digunakan di dalam CartProvider');
  }
  return context;
};
