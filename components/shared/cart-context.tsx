"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import type { Product } from "@/types"; // 1. Import your main Product type

export type CartItem = {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
  category: string;
  name_ar?: string | null;
  description_ar?: string | null;
  quantity: number;
  note?: string; 
};

interface CartContextType {
  items: CartItem[];
  // ALLOW BOTH TYPES HERE:
  addItem: (product: Product | CartItem, note?: string) => void; 
  removeItem: (id: string, note?: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  totalPrice: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  useEffect(() => {
   
    const initCart = setTimeout(() => {
      const savedCart = localStorage.getItem("cloudy_cart");
      if (savedCart) {
        try {
          setItems(JSON.parse(savedCart));
        } catch (e) {
          console.error("Cart recovery failed", e);
        }
      }
    }, 0);

    return () => clearTimeout(initCart);
  }, []);

  // Save to LocalStorage whenever items change
  useEffect(() => {
    localStorage.setItem("cloudy_cart", JSON.stringify(items));
  }, [items]);

  // 3. Strongly type the product parameter
  const addItem = (product: Product | CartItem, note?: string) => {
    setItems((prev) => {
      const normalizedNote = note?.trim() || "";

      const existingItem = prev.find(
        (item) => item.id === product.id && (item.note || "") === normalizedNote
      );

      if (existingItem) {
        return prev.map((item) =>
          item.id === product.id && (item.note || "") === normalizedNote
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      // 4. Explicitly map Product to CartItem to satisfy strict TypeScript rules
      // This prevents "excess property" errors from fields like 'stock' or 'brand'
      const newItem: CartItem = {
        id: product.id,
        name: product.name,
        slug: product.slug || "", // Fallback in case slug isn't strictly required
        price: Number(product.price), // Ensure it stays a number
        images: product.images || [],
        category: product.category,
        name_ar: product.name_ar,
        description_ar: product.description_ar,
        quantity: 1,
        note: normalizedNote,
      };

      return [...prev, newItem];
    });
  };

  const removeItem = (id: string, note?: string) => {
    setItems((prev) => {
      const normalizedNote = note || "";

      const existingItem = prev.find(
        (item) => item.id === id && (item.note || "") === normalizedNote
      );

      if (existingItem && existingItem.quantity > 1) {
        return prev.map((item) =>
          item.id === id && (item.note || "") === normalizedNote
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      } else {
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

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};