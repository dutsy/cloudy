"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
// 1. Add 'note' to the CartItem definition
export type CartItem = {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
  category: string;
  quantity: number;
  note?: string; // The '?' means a note is optional (not every item needs one)
};

// 2. Update the addItem signature to accept a note
interface CartContextType {
  items: CartItem[];
  // Acceptance of an optional note string
  addItem: (product: any, note?: string) => void; 
  removeItem: (id: string, note?: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  totalPrice: number;
  itemCount: number;
}
const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from LocalStorage on startup
  useEffect(() => {
    const savedCart = localStorage.getItem("cloudy_cart");
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Cart recovery failed", e);
      }
    }
  }, []);

  // Save to LocalStorage whenever items change
  useEffect(() => {
    localStorage.setItem("cloudy_cart", JSON.stringify(items));
  }, [items]);

  const addItem = (product: any, note?: string) => {
  setItems((prev) => {
    // Normalizing the note so we don't compare 'undefined' to ""
    const normalizedNote = note?.trim() || "";

    // Look for an item that matches BOTH the ID and the exact same Note
    const existingItem = prev.find(
      (item) => item.id === product.id && (item.note || "") === normalizedNote
    );

    if (existingItem) {
      // If found, just bump the quantity for that specific ID + Note combo
      return prev.map((item) =>
        item.id === product.id && (item.note || "") === normalizedNote
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    }

    // If not found, add it as a new row in the cart
    return [...prev, { ...product, quantity: 1, note: normalizedNote }];
  });
};

  const removeItem = (id: string, note?: string) => {
  setItems((prev) => {
    // Normalizing the note to ensure consistency with addItem
    const normalizedNote = note || "";

    // 1. Find the specific item matching both ID AND Note
    const existingItem = prev.find(
      (item) => item.id === id && (item.note || "") === normalizedNote
    );

    if (existingItem && existingItem.quantity > 1) {
      // 2. Decrease quantity only for that specific ID + Note combo
      return prev.map((item) =>
        item.id === id && (item.note || "") === normalizedNote
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
    } else {
      // 3. Remove that specific entry entirely if quantity is 1
      return prev.filter(
        (item) => !(item.id === id && (item.note || "") === normalizedNote)
      );
    }
  });
};

  const updateQuantity = (id: string, qty: number) => {
    if (qty < 1) return;
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: qty } : item))
    );
  };

  const clearCart = () => setItems([]);

  // Calculations
  const totalPrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalPrice, itemCount }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook for easy access
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};