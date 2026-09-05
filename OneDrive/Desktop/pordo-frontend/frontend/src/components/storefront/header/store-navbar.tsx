"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { mockCategories } from "@/lib/mock-data";
import {
  Menu,
  ChevronDown,
  Sparkles,
  Flame,
  Tag,
  PhoneCall,
  LayoutGrid,
} from "lucide-react";

export function StoreNavbar() {
  const pathname = usePathname();
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Products", path: "/#products" },
    { label: "Categories", path: "/#categories" },
    { label: "Brands", path: "/#brands" },
    { label: "Flash Deals", path: "/#deals", badge: "Hot" },
    { label: "Track Order", path: "/orders" },
    { label: "Admin POS", path: "/orders/new" },
  ];

  return (
    <nav className="bg-[#0b1320] text-slate-200 hidden lg:block border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Left: All Categories Dropdown Trigger */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setCategoriesOpen(!categoriesOpen)}
            className="h-12 px-5 bg-[#056D6E] hover:bg-[#044342] text-white font-bold text-xs flex items-center gap-2.5 transition-colors cursor-pointer rounded-t-lg"
          >
            <LayoutGrid className="size-4" />
            <span className="tracking-wide uppercase">All Categories</span>
            <ChevronDown className="size-3.5 ml-1" />
          </button>

          {/* Categories Mega List Dropdown */}
          {categoriesOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setCategoriesOpen(false)}
              />
              <div className="absolute left-0 top-full w-64 bg-white text-slate-800 rounded-b-2xl shadow-xl border border-slate-200 py-2 z-40 animate-in fade-in-50 divide-y divide-slate-100">
                {mockCategories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/#category-${cat.slug}`}
                    onClick={() => setCategoriesOpen(false)}
                    className="flex items-center justify-between px-4 py-2.5 hover:bg-slate-50 transition-colors text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="size-6.5 rounded-md object-cover border border-slate-200"
                      />
                      <span className="font-semibold text-slate-800">{cat.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold bg-slate-100 px-1.5 py-0.2 rounded">
                      {cat.productCount}
                    </span>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Center: Main Nav Links */}
        <ul className="flex items-center gap-1 xl:gap-2 text-xs font-semibold">
          {navLinks.map((link) => {
            const isActive = pathname === link.path;
            return (
              <li key={link.label}>
                <Link
                  href={link.path}
                  className={`px-3 py-3.5 inline-flex items-center gap-1.5 transition-colors ${
                    isActive
                      ? "text-emerald-400 font-bold"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="bg-rose-500 text-white text-[9px] font-extrabold px-1.5 py-0.2 rounded-full uppercase animate-pulse">
                      {link.badge}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Right: Promotional Hotline / Trending CTA */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-amber-300 font-bold bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
            <Flame className="size-3.5 text-orange-400" />
            <span>Eid Mega Sale - Up to 40% OFF</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
