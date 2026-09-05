"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  RotateCcw,
  Home,
  LayoutDashboard,
  Store,
  Phone,
  ShieldAlert,
} from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between antialiased selection:bg-rose-500 selection:text-white">
      {/* Header */}
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

          <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
            System Error
          </span>
        </div>
      </header>

      {/* Main Error Body */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl text-center space-y-6 animate-in zoom-in-95 duration-200 relative overflow-hidden">
          {/* Top Rose Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-500 via-amber-500 to-rose-500" />

          {/* Icon */}
          <div className="size-16 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto shadow-2xs">
            <AlertTriangle className="size-8" />
          </div>

          {/* Title & Message */}
          <div className="space-y-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Something Went Wrong!
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
              An unexpected error occurred while loading this page. Our team has been notified.
            </p>
          </div>

          {/* Error Digest Box if available */}
          {error?.digest && (
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] font-mono text-slate-500 truncate">
              Error Digest: {error.digest}
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-1 text-xs font-bold">
            <button
              type="button"
              onClick={() => reset()}
              className="w-full py-3 px-4 rounded-xl bg-[#056D6E] hover:bg-[#044342] text-white flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <RotateCcw className="size-4" />
              <span>Try Again / Reload Page</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/"
                className="py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Home className="size-3.5" />
                <span>Storefront</span>
              </Link>

              <Link
                href="/dashboard"
                className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
              >
                <LayoutDashboard className="size-3.5 text-emerald-400" />
                <span>Dashboard</span>
              </Link>
            </div>
          </div>

          {/* Contact Support */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-500">
            <span>Need immediate help?</span>
            <div className="flex items-center gap-1 font-bold text-slate-800">
              <Phone className="size-3 text-emerald-600" />
              <span>+880 1700-112233</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-400 border-t border-slate-200 bg-white">
        © 2026 Pordo E-Commerce Store. All rights reserved.
      </footer>
    </div>
  );
}
