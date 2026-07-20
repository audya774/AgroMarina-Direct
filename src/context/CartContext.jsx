import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('agromarina_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('agromarina_cart', JSON.stringify(cart));
  }, [cart]);
  
  const addToCart = (product, quantity = 1) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => (item.id || item.name) === (product.id || product.name));
      if (existingItem) {
        return prevCart.map((item) =>
          (item.id || item.name) === (product.id || product.name) 
            ? { ...item, qty: item.qty + quantity } 
            : item
        );
      }
      return [...prevCart, { ...product, qty: quantity, duration: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => (item.id || item.name) !== id));
  };

  const updateQuantity = (id, newQty) => {
    if (newQty <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) => ((item.id || item.name) === id ? { ...item, qty: newQty } : item))
    );
  };

  // 🟢 FUNGSI BARU: Agar tombol Durasi 7 Hari bisa berfungsi
  const updateDuration = (id, newDuration) => {
    setCart((prevCart) =>
      prevCart.map((item) => ((item.id || item.name) === id ? { ...item, duration: newDuration } : item))
    );
  };

  const clearCart = () => setCart([]);

  // 🟢 RUMUS BARU: Menghitung Subtotal dengan mengalikan Unit & Durasi
  const subTotal = cart.reduce((sum, item) => {
    const itemQty = item.qty || 1;
    const itemDuration = item.tipe === 'sewa' ? (item.duration || 1) : 1;
    return sum + (item.price * itemQty * itemDuration);
  }, 0);
  
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  
  const syncWithDatabase = (latestProducts) => {
    setCart((prevCart) => {
      let isUpdated = false;
      const newCart = prevCart.map(cartItem => {
        const freshData = latestProducts.find(p => p.id === cartItem.id);
        if (freshData) {
          if (cartItem.stock !== freshData.stock || cartItem.price !== freshData.price) {
            isUpdated = true;
            return { ...cartItem, stock: freshData.stock, price: freshData.price };
          }
        }
        return cartItem;
      });
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
        updateDuration, // 🟢 Diekspor ke aplikasi
        syncWithDatabase,
        clearCart,
        subTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart harus digunakan di dalam CartProvider');
  return context;
};
