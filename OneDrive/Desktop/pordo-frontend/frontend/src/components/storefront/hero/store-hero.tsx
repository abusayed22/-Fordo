"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Flame, ShieldCheck, Truck, Clock } from "lucide-react";

export function StoreHero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      badge: "Exclusive Eid-Ul-Fitr Collection 2026",
      title: "Discover Premium Handcrafted Ethnic & Modest Wear",
      desc: "Get up to 40% discount on Silk Panjabi, Jamdani Sarees, Abayas and Designer Kurtis.",
      cta: "Shop The Collection",
      bgGradient: "from-[#044342] via-[#056D6E] to-[#0A8788]",
      image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&auto=format&fit=crop&q=80",
    },
    {
      badge: "Festive Dhakai Jamdani Sarees",
      title: "Authentic Handloom Weaves for Special Moments",
      desc: "Handcrafted by heritage Dhakai artisans. Free nationwide doorstep delivery.",
      cta: "Explore Sarees",
      bgGradient: "from-[#632035] via-[#831843] to-[#9D174D]",
      image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 pt-3 sm:pt-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Main Hero Banner (8 Cols) */}
        <div className="lg:col-span-8">
          <div
            className={`rounded-2xl sm:rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden bg-gradient-to-r ${slides[currentSlide].bgGradient} shadow-md flex flex-col justify-between min-h-[360px] sm:min-h-[420px]`}
          >
            {/* Background Graphic Accent */}
            <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />

            <div className="relative z-10 max-w-lg space-y-3 sm:space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur-xs text-amber-300 border border-white/20">
                <Sparkles className="size-3" />
                {slides[currentSlide].badge}
              </span>

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
                {slides[currentSlide].title}
              </h1>

              <p className="text-xs sm:text-sm text-emerald-50/90 leading-relaxed max-w-md">
                {slides[currentSlide].desc}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  href="/#products"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-extrabold text-xs sm:text-sm shadow-md transition-transform hover:scale-105"
                >
                  <span>{slides[currentSlide].cta}</span>
                  <ArrowRight className="size-4" />
                </Link>

                <Link
                  href="/orders/new"
                  className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-xs text-white font-semibold text-xs transition-colors"
                >
                  <span>Fast POS Order</span>
                </Link>
              </div>
            </div>

            {/* Slide Dots */}
            <div className="relative z-10 flex items-center gap-2 pt-4">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    currentSlide === idx ? "w-7 bg-amber-400" : "w-2 bg-white/40 hover:bg-white/70"
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Promotional Mini Banners (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-4">
          {/* Top Mini Card */}
          <div className="flex-1 rounded-2xl p-5 bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-xs relative overflow-hidden flex flex-col justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-black/20 px-2 py-0.5 rounded self-start">
              Weekend Flash Deal
            </span>
            <div className="my-3">
              <h3 className="text-lg font-extrabold leading-snug">
                Men&apos;s Formal Shirts &amp; Kurtis Flat 25% Off
              </h3>
              <p className="text-xs text-amber-100 mt-1">Starting from ৳1,450 only</p>
            </div>
            <Link
              href="/#products"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 bg-white px-3 py-1.5 rounded-lg self-start hover:bg-amber-50 transition-colors shadow-2xs"
            >
              Shop Deals <ArrowRight className="size-3" />
            </Link>
          </div>

          {/* Bottom Mini Card */}
          <div className="flex-1 rounded-2xl p-5 bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-xs relative overflow-hidden flex flex-col justify-between border border-slate-800">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded self-start">
              Express Delivery
            </span>
            <div className="my-3">
              <h3 className="text-lg font-extrabold leading-snug">
                Inside Dhaka Same-Day &amp; 24H Courier Dispatch
              </h3>
              <p className="text-xs text-slate-400 mt-1">Cash on Delivery across 64 districts</p>
            </div>
            <Link
              href="/orders"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg self-start transition-colors border border-slate-700"
            >
              Track Deliveries <ArrowRight className="size-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
