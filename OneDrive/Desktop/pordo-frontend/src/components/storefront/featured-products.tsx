"use client";

import React, { useState } from "react";
import { mockProducts, mockBrands } from "@/lib/mock-data";
import { ProductCard } from "./product-card";
import { Sparkles, Flame, Tag, Award } from "lucide-react";

export function FeaturedProducts() {
  const [activeTab, setActiveTab] = useState<string>("All");

  const tabs = ["All", "Eid Special", "Mens Ethnic", "Womens Wear", "Saree", "Mens Formal"];

  const filteredProducts = mockProducts.filter((p) => {
    if (activeTab === "All") return true;
    if (activeTab === "Eid Special") return p.salePrice >= 3000;
    return p.category.toLowerCase().includes(activeTab.toLowerCase());
  });

  return (
    <section id="products" className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Section Header with Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Featured Collections
            </h2>
            <span className="flex items-center gap-1 text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
              <Flame className="size-3 fill-current" /> Hot
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Discover top trending fashion styles with nationwide doorstep delivery
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar-gray pb-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                activeTab === tab
                  ? "bg-[#056D6E] text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Brand Partners Showcase */}
      <div id="brands" className="pt-8 border-t border-slate-200/80">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Official Brand Partners
            </h3>
            <p className="text-xs text-slate-400">100% authentic collections directly from manufacturers</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {mockBrands.map((brand) => (
            <div
              key={brand.id}
              className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs hover:border-[#056D6E] transition-all flex items-center gap-3"
            >
              <img
                src={brand.logo}
                alt={brand.name}
                className="size-10 rounded-lg object-cover border border-slate-100 shrink-0"
              />
              <div className="min-w-0">
                <h4 className="font-bold text-xs text-slate-900 truncate">{brand.name}</h4>
                <span className="text-[10px] text-slate-400 block">{brand.productCount} Products</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
