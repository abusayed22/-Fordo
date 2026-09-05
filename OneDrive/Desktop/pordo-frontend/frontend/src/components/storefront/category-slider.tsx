"use client";

import React from "react";
import Link from "next/link";
import { mockCategories } from "@/lib/mock-data";
import { ChevronRight } from "lucide-react";

export function CategorySlider() {
  return (
    <section id="categories" className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-8">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div>
          <h2 className="text-lg sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Shop by Category
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Explore our curated fashion & lifestyle collections
          </p>
        </div>

        <Link
          href="/#products"
          className="inline-flex items-center gap-1 text-xs font-bold text-[#056D6E] hover:underline"
        >
          View All <ChevronRight className="size-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        {mockCategories.map((cat) => (
          <Link
            key={cat.id}
            href={`/#category-${cat.slug}`}
            className="group p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:border-[#056D6E] hover:shadow-md transition-all flex flex-col items-center text-center cursor-pointer"
          >
            <div className="size-20 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 mb-3 p-1 transition-transform group-hover:scale-105">
              <img
                src={cat.image}
                alt={cat.name}
                className="size-full rounded-xl object-cover"
              />
            </div>
            <h3 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-[#056D6E] transition-colors line-clamp-1">
              {cat.name}
            </h3>
            <span className="text-[11px] text-slate-400 font-medium mt-0.5">
              {cat.productCount} Products
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
