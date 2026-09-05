"use client";

import React from "react";
import Link from "next/link";
import { useStoreCart } from "@/context/store-cart-context";
import {
  X,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  Truck,
  CheckCircle2,
} from "lucide-react";

export function StoreCartDrawer() {
  const {
    cart,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    removeFromCart,
    updateQuantity,
    cartSubtotal,
    freeShippingThreshold,
  } = useStoreCart();

  if (!isCartDrawerOpen) return null;

  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);
  const progressPercent = Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="size-5 text-[#056D6E]" />
              <h3 className="font-bold text-base text-slate-900">
                Shopping Cart ({cart.reduce((acc, i) => acc + i.quantity, 0)})
              </h3>
            </div>
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="size-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="p-4 bg-emerald-50/60 border-b border-emerald-100/60 text-xs">
            <div className="flex items-center justify-between text-slate-700 font-semibold mb-1.5">
              <div className="flex items-center gap-1.5">
                <Truck className="size-4 text-emerald-600" />
                {remainingForFreeShipping === 0 ? (
                  <span className="text-emerald-700 font-bold">🎉 You unlocked FREE Delivery!</span>
                ) : (
                  <span>
                    Add <strong className="text-emerald-800">৳{remainingForFreeShipping}</strong> more for <strong>FREE Delivery</strong>
                  </span>
                )}
              </div>
              <span className="font-mono text-emerald-800 font-bold">{progressPercent}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
              <div
                className="h-full bg-emerald-600 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 custom-scrollbar-gray space-y-3">
            {cart.length === 0 ? (
              <div className="py-16 text-center">
                <div className="size-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-3">
                  <ShoppingBag className="size-8" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Your cart is empty</h4>
                <p className="text-xs text-slate-400 mt-1">Looks like you haven&apos;t added anything yet.</p>
                <button
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="mt-4 px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.product.id}
                  className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between gap-3 text-xs shadow-2xs hover:border-slate-300 transition-colors"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="size-14 rounded-lg object-cover border border-slate-100 shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <h5 className="font-bold text-slate-900 truncate">
                      {item.product.name}
                    </h5>
                    <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                      <span>Size: {item.selectedSize}</span>
                      <span>•</span>
                      <span>৳{item.product.salePrice}</span>
                    </div>

                    {/* Quantity modifier */}
                    <div className="flex items-center gap-1.5 mt-2">
                      <div className="flex items-center border border-slate-200 rounded-md bg-slate-50">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="size-6 flex items-center justify-center text-slate-600 hover:bg-slate-200 rounded-l cursor-pointer"
                        >
                          <Minus className="size-2.5" />
                        </button>
                        <span className="w-6 text-center font-bold text-xs text-slate-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="size-6 flex items-center justify-center text-slate-600 hover:bg-slate-200 rounded-r cursor-pointer"
                        >
                          <Plus className="size-2.5" />
                        </button>
                      </div>

                      <span className="font-bold text-slate-900 ml-auto">
                        ৳{(item.product.salePrice * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer self-start"
                    title="Remove item"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/80 space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-900">
                    ৳{cartSubtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Estimated Delivery</span>
                  <span className="font-semibold text-emerald-700">
                    {remainingForFreeShipping === 0 ? "FREE" : "৳80 - ৳150"}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm font-extrabold text-slate-900">
                <span>Total Amount</span>
                <span className="text-lg text-[#056D6E]">
                  ৳{cartSubtotal.toLocaleString()}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  href="/orders/new"
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs text-center flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                >
                  <span>Checkout</span>
                  <ArrowRight className="size-3.5" />
                </Link>
                <button
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    alert("Proceeding to cart view.");
                  }}
                  className="py-2.5 rounded-xl border border-slate-300 hover:bg-white text-slate-800 font-bold text-xs text-center transition-colors"
                >
                  View Cart
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
