"use client";

import React from "react";
import Link from "next/link";
import { Phone, Truck, Clock, ShieldCheck, Heart, MapPin } from "lucide-react";

export function StoreTopbar() {
  return (
    <div className="bg-[#056D6E] text-white text-[11px] py-1.5 px-3 sm:px-6 border-b border-emerald-600/30">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1.5 sm:gap-4">
        {/* Left: Promotional Banner */}
        <div className="flex items-center gap-2 text-center sm:text-left">
          <span className="bg-amber-400 text-slate-900 font-bold px-1.5 py-0.2 rounded text-[9px] uppercase tracking-wider">
            Eid Offer
          </span>
          <p className="text-emerald-50">
            <span className="font-semibold text-white">FREE Delivery</span> on orders over ৳2,500! Use code:{" "}
            <span className="font-bold underline text-amber-300 font-mono">EID2026</span>
          </p>
        </div>

        {/* Right: Phone, Track Order, Dashboard Link */}
        <div className="flex items-center gap-3 sm:gap-4 text-emerald-100">
          <div className="hidden md:flex items-center gap-1.5">
            <Phone className="size-3 text-amber-300" />
            <span>Hotline: <strong className="text-white font-mono">+880 1700-112233</strong></span>
          </div>

          <div className="hidden sm:block h-3 w-px bg-emerald-500/50" />

          <Link
            href="/orders"
            className="hover:text-white transition-colors flex items-center gap-1"
          >
            <Truck className="size-3" />
            <span>Track Order</span>
          </Link>

          <div className="h-3 w-px bg-emerald-500/50" />

          {/* Quick link to Admin / Staff Hub */}
          <Link
            href="/dashboard"
            className="flex items-center gap-1 bg-slate-900/40 hover:bg-slate-900 text-amber-300 hover:text-amber-200 px-2 py-0.5 rounded font-bold transition-all text-[10px]"
          >
            <ShieldCheck className="size-3" />
            <span>Admin / POS Hub</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
