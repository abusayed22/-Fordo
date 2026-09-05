"use client";

import React, { useState } from "react";
import { useRole, UserRole } from "@/context/role-context";
import {
  Menu,
  Search,
  Bell,
  ShieldCheck,
  User,
  ChevronDown,
  LogOut,
  Check,
  X,
  Store,
  Truck,
  Warehouse,
  ShoppingBag,
  Building2,
} from "lucide-react";
import Link from "next/link";

export function Header({
  setIsMobileOpen,
}: {
  setIsMobileOpen: (open: boolean) => void;
}) {
  const { role, setRole, roleTitle, roleBadgeColor } = useRole();
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const roleOptions: { role: UserRole; label: string; desc: string; color: string }[] = [
    {
      role: "ADMIN",
      label: "ADMIN",
      desc: "Super Admin (Full System Access)",
      color: "#10B981",
    },
    {
      role: "MANAGER",
      label: "MANAGER",
      desc: "Operations & Catalog CRUD",
      color: "#3B82F6",
    },
    {
      role: "MANUAL_ORDER_ENTRY",
      label: "MANUAL ORDER ENTRY",
      desc: "Order Officer (Fast POS Entry)",
      color: "#F59E0B",
    },
    {
      role: "WAREHOUSE_MANAGER",
      label: "WAREHOUSE MANAGER",
      desc: "Inventory, Depot & Stock Control",
      color: "#F97316",
    },
    {
      role: "VENDOR",
      label: "VENDOR",
      desc: "Merchant Products & Brands",
      color: "#EC4899",
    },
    {
      role: "DELIVERY_MAN",
      label: "DELIVERY MAN",
      desc: "Rider Tasks & COD Collections",
      color: "#06B6D4",
    },
    {
      role: "CUSTOMER",
      label: "CUSTOMER",
      desc: "Customer Portal & Order History",
      color: "#8B5CF6",
    },
  ];

  const handleRoleSelect = (newRole: UserRole) => {
    setRole(newRole);
    setRoleDropdownOpen(false);
  };

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

            {/* 7-Role Switcher Pill */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 rounded-lg text-xs font-semibold border border-slate-200 hover:bg-slate-100 bg-white transition-all cursor-pointer touch-manipulation shadow-2xs"
              >
                <span
                  className="size-2 rounded-full"
                  style={{ backgroundColor: roleBadgeColor }}
                />
                <span className="font-bold text-[10px] sm:text-[11px] text-slate-800">
                  {role.replace("_", " ")}
                </span>
                <ChevronDown className="size-3 text-slate-400 ml-0.5" />
              </button>

              {roleDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setRoleDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-1.5 w-64 sm:w-72 rounded-2xl bg-white border border-slate-200 p-2 shadow-2xl z-50 text-xs animate-in fade-in-50 space-y-1">
                    <div className="px-2.5 py-1.5 border-b border-slate-100 mb-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Switch Active Role &amp; Layout
                      </p>
                    </div>

                    {roleOptions.map((opt) => {
                      const isCurrent = role === opt.role;
                      return (
                        <button
                          key={opt.role}
                          onClick={() => handleRoleSelect(opt.role)}
                          className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors cursor-pointer ${
                            isCurrent
                              ? "bg-slate-100 text-slate-900 font-bold"
                              : "hover:bg-slate-50 text-slate-700"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span
                              className="size-2.5 rounded-full shrink-0"
                              style={{ backgroundColor: opt.color }}
                            />
                            <div className="min-w-0">
                              <p className="font-semibold text-xs text-slate-900 leading-tight">
                                {opt.label}
                              </p>
                              <span className="text-[10px] text-slate-400 truncate block">
                                {opt.desc}
                              </span>
                            </div>
                          </div>
                          {isCurrent && <Check className="size-4 text-slate-900 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

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
