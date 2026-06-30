// src/context/CartContext.jsx
import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // 1. Tambah Produk ke Keranjang (Mendukung kuantitas kustom dari Product Detail)
  const addToCart = (product, quantity = 1) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + quantity } : item
        );
      }
      return [...prevCart, { ...product, qty: quantity }];
    });
  };

  // 2. Hapus Produk dari Keranjang
  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  // 3. Ubah Kuantitas Langsung (Untuk tombol tambah/kurang di Checkout atau Sidebar)
  const updateQuantity = (id, newQty) => {
    if (newQty <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) => (item.id === id ? { ...item, qty: newQty } : item))
    );
  };

  // 4. Kosongkan Keranjang (Dipanggil setelah Checkout sukses)
  const clearCart = () => setCart([]);

  // Kuantitas total item dan subtotal harga otomatis dihitung di sini
  const subTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

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
