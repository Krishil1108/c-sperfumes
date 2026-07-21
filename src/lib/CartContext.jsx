'use client'

import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Load cart items from localStorage on mount
  useEffect(() => {
    setIsMounted(true);
    const storedCart = localStorage.getItem('cnss_luxury_cart');
    if (storedCart) {
      try {
        setCartItems(JSON.parse(storedCart));
      } catch (err) {
        console.error("Failed to parse cart items from storage", err);
      }
    }
  }, []);

  // Save cart items to localStorage on change
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('cnss_luxury_cart', JSON.stringify(cartItems));
    }
  }, [cartItems, isMounted]);

  const addToCart = (product, quantity = 1) => {
    if (product.inStock === false) {
      console.warn(`Attempted to add out-of-stock product to cart: ${product.title}`);
      return;
    }
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevItems, { ...product, quantity }];
    });
    
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'AddToCart', {
        content_ids: [product.id || product._id],
        content_name: product.title,
        currency: 'INR',
        value: product.salePrice
      });
    }
    
    setIsCartOpen(true); // Automatically slide open the cart drawer when adding an item!
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  };

  const updateQty = (productId, amount) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) => {
          if (item.id === productId) {
            const newQty = item.quantity + amount;
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const cartTotal = cartItems.reduce((acc, item) => acc + item.salePrice * item.quantity, 0);
  const cartSavings = cartSubtotal - cartTotal;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        cartCount,
        cartSubtotal,
        cartTotal,
        cartSavings,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
