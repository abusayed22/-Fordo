"use client";

import React, { useState } from "react";
import Link from "next/link";
import { StoreTopbar } from "./header/store-topbar";
import { StoreHeader } from "./header/store-header";
import { StoreNavbar } from "./header/store-navbar";
import { StoreCartDrawer } from "./header/store-cart-drawer";
import { StoreFooter } from "./footer/store-footer";
import { mockCategories } from "@/lib/mock-data";
import { X, LayoutGrid, ShieldCheck, Phone, Heart, ShoppingBag } from "lucide-react";

export function StoreLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-900 antialiased">
      {/* Top promotional bar */}
      <StoreTopbar />

      {/* Main header with search & cart */}
      <StoreHeader onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />

      {/* Sticky categories & nav links bar */}
      <StoreNavbar />

      {/* Cart Slide-Over Drawer */}
      <StoreCartDrawer />

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden animate-in fade-in">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-2xl flex flex-col justify-between p-5">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="font-extrabold text-base text-slate-900">PORDO MART</span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="size-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="space-y-1 text-sm font-semibold text-slate-700">
                <Link
                  href="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg hover:bg-slate-100"
                >
                  Home
                </Link>
                <Link
                  href="/#products"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg hover:bg-slate-100"
                >
                  All Products
                </Link>
                <Link
                  href="/#categories"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg hover:bg-slate-100"
                >
                  Categories
                </Link>
                <Link
                  href="/#brands"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg hover:bg-slate-100"
                >
                  Brands
                </Link>
                <Link
                  href="/#deals"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg hover:bg-slate-100 text-rose-600"
                >
                  Flash Deals 🔥
                </Link>
                <Link
                  href="/orders"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg hover:bg-slate-100"
                >
                  Track Orders
                </Link>
              </div>

              {/* Categories list */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Categories
                </span>
                <div className="space-y-1 text-xs">
                  {mockCategories.map((c) => (
                    <Link
                      key={c.id}
                      href={`/#category-${c.slug}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-3 py-1.5 text-slate-600 hover:text-[#056D6E]"
                    >
                      {c.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Admin Hub shortcut button */}
            <div className="pt-4 border-t border-slate-100">
              <Link
                href="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm"
              >
                <ShieldCheck className="size-4 text-amber-300" />
                <span>Admin &amp; POS Dashboard</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Storefront Main Content */}
      <main className="flex-1 pb-12">
        {children}
      </main>

      {/* Storefront Footer */}
      <StoreFooter />
    </div>
  );
}
