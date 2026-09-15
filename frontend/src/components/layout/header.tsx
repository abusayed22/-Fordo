"use client";

import React, { useState } from "react";
import {
  Menu,
  Search,
  Bell,
  ShieldCheck,
  User,
  ChevronDown,
  LogOut,
  X,
  Store,
} from "lucide-react";
import Link from "next/link";

export function Header({
  setIsMobileOpen,
}: Readonly<{
  setIsMobileOpen: (open: boolean) => void;
}>) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="sticky top-0 z-30 flex h-14 sm:h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/95 backdrop-blur-xs px-3 sm:px-6 lg:px-8">
      {/* Mobile Search Overlay when expanded */}
      {mobileSearchOpen ? (
        <div className="flex items-center gap-2 w-full animate-in fade-in">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <input
              type="text"
              autoFocus
              placeholder="Search orders, phone, products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-3 rounded-lg bg-slate-100 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none"
            />
          </div>
          <button
            onClick={() => setMobileSearchOpen(false)}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100"
          >
            <X className="size-4" />
          </button>
        </div>
      ) : (
        <>
          {/* Left: Mobile Menu Trigger & Desktop Search Bar */}
          <div className="flex items-center gap-2 sm:gap-4 flex-1">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="xl:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer touch-manipulation"
              aria-label="Open mobile menu"
            >
              <Menu className="size-5.5" />
            </button>

            {/* Desktop Search */}
            <div className="relative max-w-xs sm:max-w-sm w-full hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search orders, phone, products, brands..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-8.5 pl-9 pr-3 rounded-lg bg-slate-50 border border-slate-200/70 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:border-slate-400 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Right: Mobile Search Icon, Role Switcher, Notification, User Profile */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* View Storefront Link */}
            <Link
              href="/"
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-colors"
            >
              <Store className="size-3.5" />
              <span>Storefront</span>
            </Link>

            {/* Mobile Search Icon button */}
            <button
              onClick={() => setMobileSearchOpen(true)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
              title="Search"
            >
              <Search className="size-4" />
            </button>

            {/* Notifications Icon */}
            <button
              className="relative p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors cursor-pointer"
              title="Notifications"
            >
              <Bell className="size-4" />
              <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-rose-500" />
            </button>

            {/* User Profile */}
            <div className="relative pl-1 border-l border-slate-200">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-1.5 sm:gap-2 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <div className="size-7 sm:size-7.5 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                  AS
                </div>
                <ChevronDown className="size-3 text-slate-400" />
              </button>

              {userMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setUserMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-1.5 w-48 rounded-xl bg-white border border-slate-200 p-1.5 shadow-xl z-50 text-xs animate-in fade-in-50">
                    <div className="px-2.5 py-1.5 border-b border-slate-100 mb-1">
                      <p className="font-semibold text-slate-900">Abu Sayed</p>
                      <p className="text-[11px] text-slate-400">sayed@pordo.com</p>
                    </div>
                    <Link
                      href="/settings/users"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <User className="size-3.5 text-slate-400" />
                      Officer Profile
                    </Link>
                    <Link
                      href="/settings"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <ShieldCheck className="size-3.5 text-slate-400" />
                      Settings
                    </Link>
                    <div className="border-t border-slate-100 my-1" />
                    <button
                      onClick={() => setUserMenuOpen(false)}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      <LogOut className="size-3.5" />
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </header>
  );
}
