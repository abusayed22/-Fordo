"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, mockProducts } from "@/lib/mock-data";

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

interface StoreCartContextType {
  cart: CartItem[];
  wishlist: Product[];
  addToCart: (product: Product, quantity?: number, size?: string, color?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  cartCount: number;
  cartSubtotal: number;
  freeShippingThreshold: number;
}

const StoreCartContext = createContext<StoreCartContextType | undefined>(undefined);

export function StoreCartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([
    {
      product: mockProducts[0],
      quantity: 1,
      selectedSize: "L",
      selectedColor: "Navy Blue",
    },
    {
      product: mockProducts[3],
      quantity: 2,
      selectedSize: "16",
      selectedColor: "Crisp White",
    },
  ]);
  const [wishlist, setWishlist] = useState<Product[]>([mockProducts[1]]);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  const freeShippingThreshold = 2500;

  const addToCart = (
    product: Product,
    quantity = 1,
    size?: string,
    color?: string
  ) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          product,
          quantity,
          selectedSize: size || product.sizes[0] || "Standard",
          selectedColor: color || product.colors[0] || "Standard",
        },
      ];
    });
    setIsCartDrawerOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((p) => p.id === productId);
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce(
    (acc, item) => acc + item.product.salePrice * item.quantity,
    0
  );

  return (
    <StoreCartContext.Provider
      value={{
        cart,
        wishlist,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        cartCount,
        cartSubtotal,
        freeShippingThreshold,
      }}
    >
      {children}
    </StoreCartContext.Provider>
  );
}

export function useStoreCart() {
  const context = useContext(StoreCartContext);
  if (!context) {
    throw new Error("useStoreCart must be used within a StoreCartProvider");
  }
  return context;
}
