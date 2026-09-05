"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useStoreCart } from "@/context/store-cart-context";
import { mockCategories } from "@/lib/mock-data";
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  ChevronDown,
  Store,
  Sparkles,
} from "lucide-react";

export function StoreHeader({
  onOpenMobileMenu,
}: {
  onOpenMobileMenu: () => void;
}) {
  const { cartCount, cartSubtotal, wishlist, setIsCartDrawerOpen } = useStoreCart();
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const categories = ["All Categories", ...mockCategories.map((c) => c.name)];

  return (
    <header className="bg-white border-b border-slate-100 py-3 sm:py-4 px-3 sm:px-6 sticky top-0 z-40 shadow-2xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-6">
        {/* Left: Mobile Menu Trigger & Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Toggle mobile menu"
          >
            <Menu className="size-5.5" />
          </button>

          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="size-10 rounded-xl bg-gradient-to-tr from-[#056D6E] to-[#044342] flex items-center justify-center text-white font-bold shadow-xs transition-transform group-hover:scale-105">
              <Store className="size-5 text-white" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 font-sans">
                  PORDO
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                  MART
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium -mt-1 hidden sm:block">
                Lifestyle & Fashion Store
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Ekomart-style Category Filter + Search Bar */}
        <div className="flex-1 max-w-2xl hidden md:flex items-center border-2 border-[#056D6E] rounded-xl overflow-hidden bg-white shadow-xs">
          {/* Category Dropdown inside Search */}
          <div className="relative shrink-0 border-r border-slate-200">
            <button
              type="button"
              onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
              className="h-10.5 px-3.5 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span className="max-w-[120px] truncate">{selectedCategory}</span>
              <ChevronDown className="size-3.5 text-slate-400" />
            </button>

            {categoryDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setCategoryDropdownOpen(false)}
                />
                <div className="absolute left-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-slate-200 p-1.5 z-50 text-xs animate-in fade-in-50">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(cat);
                        setCategoryDropdownOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                        selectedCategory === cat
                          ? "bg-emerald-50 text-emerald-800 font-semibold"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Search Input */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search for panjabi, sarees, shirts, dresses, abaya..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10.5 px-3.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none"
            />
          </div>

          {/* Search Button */}
          <button
            type="button"
            className="h-10.5 px-5 bg-[#056D6E] hover:bg-[#044342] text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Search className="size-4" />
            <span>Search</span>
          </button>
        </div>

        {/* Right: Account, Wishlist, Cart Drawer Button */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Account */}
          <Link
            href="/settings/users"
            className="hidden lg:flex items-center gap-2 p-2 rounded-xl hover:bg-slate-50 transition-colors text-slate-700"
          >
            <div className="size-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
              <User className="size-4.5" />
            </div>
            <div className="text-left text-xs">
              <span className="text-[10px] text-slate-400 block leading-tight">Welcome</span>
              <span className="font-bold text-slate-900">Account</span>
            </div>
          </Link>

          {/* Wishlist */}
          <button
            type="button"
            onClick={() => alert(`Wishlist has ${wishlist.length} item(s).`)}
            className="relative p-2 rounded-xl hover:bg-slate-50 transition-colors text-slate-700 cursor-pointer"
            title="Wishlist"
          >
            <Heart className="size-5.5 text-slate-700" />
            {wishlist.length > 0 && (
              <span className="absolute top-1 right-1 size-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Cart Drawer Trigger Button (Ekomart style) */}
          <button
            type="button"
            onClick={() => setIsCartDrawerOpen(true)}
            className="flex items-center gap-2 sm:gap-2.5 p-1.5 sm:px-3 sm:py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition-all cursor-pointer"
          >
            <div className="relative">
              <ShoppingBag className="size-5 text-amber-300" />
              <span className="absolute -top-1.5 -right-2 size-4 rounded-full bg-emerald-500 text-white text-[10px] font-extrabold flex items-center justify-center">
                {cartCount}
              </span>
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-[10px] text-slate-300 leading-tight">Cart Total</span>
              <span className="text-xs font-bold text-white">৳{cartSubtotal.toLocaleString()}</span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Search Bar below */}
      <div className="mt-2.5 md:hidden">
        <div className="relative flex items-center border border-slate-300 rounded-xl overflow-hidden bg-slate-50">
          <Search className="absolute left-3 size-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-3 text-xs bg-transparent text-slate-900 focus:outline-none"
          />
        </div>
      </div>
    </header>
  );
}
