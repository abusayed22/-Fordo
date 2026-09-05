"use client";

import React from "react";
import Link from "next/link";
import {
  Home,
  LayoutDashboard,
  ShoppingBag,
  ArrowLeft,
  Store,
  HelpCircle,
  Phone,
} from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between antialiased selection:bg-emerald-500 selection:text-white">
      {/* Top Simple Brand Header */}
      <header className="py-4 px-6 border-b border-slate-200/80 bg-white">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-gradient-to-tr from-[#056D6E] to-[#044342] flex items-center justify-center text-white font-bold shadow-xs">
              <Store className="size-4.5 text-white" />
            </div>
            <span className="font-extrabold text-lg text-slate-900 font-sans tracking-tight">
              PORDO MART
            </span>
          </Link>

          <Link
            href="/dashboard"
            className="text-xs font-bold text-slate-700 hover:text-[#056D6E] transition-colors"
          >
            Dashboard Hub →
          </Link>
        </div>
      </header>

      {/* Main 404 Content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="max-w-md w-full text-center space-y-6 animate-in zoom-in-95 duration-300">
          {/* 404 Large Visual Graphic */}
          <div className="relative mx-auto size-32 sm:size-40 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-emerald-100/60 blur-2xl animate-pulse" />
            <div className="size-28 sm:size-32 rounded-3xl bg-white border border-slate-200 shadow-xl flex flex-col items-center justify-center relative z-10">
              <span className="text-4xl sm:text-5xl font-black font-mono text-[#056D6E]">
                404
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                Not Found
              </span>
            </div>
          </div>

          {/* Text Information */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Oops! Page Not Found
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
              The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>
          </div>

          {/* Action Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 text-xs font-bold">
            <Link
              href="/"
              className="py-3 px-4 rounded-xl bg-[#056D6E] hover:bg-[#044342] text-white flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <Home className="size-4" />
              <span>Back to Storefront</span>
            </Link>

            <Link
              href="/dashboard"
              className="py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <LayoutDashboard className="size-4 text-emerald-400" />
              <span>Open Dashboard</span>
            </Link>
          </div>

          {/* Quick Helpful Links */}
          <div className="pt-6 border-t border-slate-200/80 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500">
            <Link href="/orders" className="hover:text-slate-900 flex items-center gap-1">
              <ShoppingBag className="size-3.5" />
              <span>Track Orders</span>
            </Link>
            <span>•</span>
            <Link href="/orders/new" className="hover:text-slate-900">
              POS Order Entry
            </Link>
            <span>•</span>
            <div className="flex items-center gap-1 text-slate-600 font-semibold">
              <Phone className="size-3 text-emerald-600" />
              <span>+880 1700-112233</span>
            </div>
          </div>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="py-4 text-center text-xs text-slate-400 border-t border-slate-200 bg-white">
        © 2026 Pordo E-Commerce Store. All rights reserved.
      </footer>
    </div>
  );
}
