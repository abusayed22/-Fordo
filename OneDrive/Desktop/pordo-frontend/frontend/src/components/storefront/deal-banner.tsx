import React from "react";
import Link from "next/link";
import { ArrowRight, TicketPercent, Clock, Flame } from "lucide-react";

export function DealBanner() {
  return (
    <section id="deals" className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-8">
      <div className="rounded-3xl bg-gradient-to-r from-[#044342] via-[#056D6E] to-[#0A8788] text-white p-6 sm:p-10 relative overflow-hidden shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Background glow */}
        <div className="absolute top-0 right-0 size-96 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-3 max-w-xl text-center md:text-left z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-slate-900 font-extrabold text-[10px] sm:text-xs uppercase tracking-wider">
            <Flame className="size-3.5 fill-current" /> Limited Time Flash Sale
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
            Special Eid Discount - Flat 15% OFF On All Orders!
          </h2>

          <p className="text-xs sm:text-sm text-emerald-100 max-w-md">
            Apply promo code at checkout or mention to our order officer for instant savings.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-black/30 border border-white/20 font-mono text-xs">
              <TicketPercent className="size-4 text-amber-300" />
              <span className="text-slate-300">Promo Code:</span>
              <strong className="text-amber-300 font-bold tracking-wider">EID2026</strong>
            </div>

            <Link
              href="/#products"
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-extrabold text-xs transition-transform hover:scale-105 shadow-md"
            >
              <span>Shop Deals</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>

        {/* Right Timer Widget */}
        <div className="p-4 sm:p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center shrink-0 z-10 w-full sm:w-auto">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-emerald-100 block mb-2">
            Sale Ends In
          </span>
          <div className="flex items-center justify-center gap-2 sm:gap-3 text-slate-900">
            <div className="bg-white p-2 sm:p-3 rounded-xl min-w-[50px] shadow-sm">
              <span className="text-lg sm:text-2xl font-black font-mono">04</span>
              <span className="text-[9px] font-bold text-slate-500 uppercase block">Days</span>
            </div>
            <span className="text-white font-bold text-xl">:</span>
            <div className="bg-white p-2 sm:p-3 rounded-xl min-w-[50px] shadow-sm">
              <span className="text-lg sm:text-2xl font-black font-mono">18</span>
              <span className="text-[9px] font-bold text-slate-500 uppercase block">Hours</span>
            </div>
            <span className="text-white font-bold text-xl">:</span>
            <div className="bg-white p-2 sm:p-3 rounded-xl min-w-[50px] shadow-sm">
              <span className="text-lg sm:text-2xl font-black font-mono">42</span>
              <span className="text-[9px] font-bold text-slate-500 uppercase block">Mins</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
