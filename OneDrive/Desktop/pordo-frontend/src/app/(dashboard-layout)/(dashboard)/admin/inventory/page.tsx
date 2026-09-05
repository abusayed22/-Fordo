"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useRole } from "@/context/role-context";
import { AccessDenied } from "@/components/common/access-denied";
import { mockProducts, Product } from "@/lib/mock-data";
import {
  Boxes,
  AlertTriangle,
  Plus,
  Minus,
  Search,
  ArrowUpRight,
  XCircle,
} from "lucide-react";

export default function InventoryPage() {
  const { hasManagerAccess, role } = useRole();
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [activeFilter, setActiveFilter] = useState<"All" | "In Stock" | "Low Stock" | "Out of Stock">("All");
  const [searchQuery, setSearchQuery] = useState("");

  if (!hasManagerAccess) {
    return (
      <div>
        <AccessDenied pageTitle="Inventory & Stock Management" allowedRoles={["ADMIN", "MANAGER"]} />
      </div>
    );
  }

  const handleStockAdjust = (id: string, delta: number) => {
    setProducts(
      products.map((p) => {
        if (p.id !== id) return p;
        const newStock = Math.max(0, p.stock + delta);
        let newStatus: Product["status"] = "In Stock";
        if (newStock === 0) newStatus = "Out of Stock";
        else if (newStock <= p.lowStockThreshold) newStatus = "Low Stock";
        return { ...p, stock: newStock, status: newStatus };
      })
    );
  };

  const totalStockCount = products.reduce((acc, p) => acc + p.stock, 0);
  const lowStockCount = products.filter((p) => p.status === "Low Stock").length;
  const outOfStockCount = products.filter((p) => p.status === "Out of Stock").length;
  const totalValuation = products.reduce((acc, p) => acc + p.stock * p.salePrice, 0);

  const filteredProducts = products.filter((p) => {
    const matchesFilter = activeFilter === "All" || p.status === activeFilter;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div>
      <div className="space-y-5">
        {/* Page Header */}
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Inventory & Stock
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Stock levels, inventory valuation and instant restocking controls
          </p>
        </div>

        {/* 4 Minimal Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Total In-Stock Units
            </span>
            <h3 className="text-xl font-bold text-slate-900 mt-1">{totalStockCount}</h3>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Inventory Value
            </span>
            <h3 className="text-xl font-bold text-slate-900 mt-1">
              ৳{totalValuation.toLocaleString()}
            </h3>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Low Stock Alerts
            </span>
            <h3 className="text-xl font-bold text-amber-600 mt-1">{lowStockCount} Products</h3>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Out of Stock
            </span>
            <h3 className="text-xl font-bold text-rose-600 mt-1">{outOfStockCount} Products</h3>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-3 shadow-xs flex flex-col sm:flex-row gap-2.5 items-center justify-between">
          <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar-gray w-full sm:w-auto">
            {(["All", "In Stock", "Low Stock", "Out of Stock"] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-all cursor-pointer ${
                  activeFilter === filter
                    ? "bg-slate-900 text-white font-semibold"
                    : "bg-slate-100/70 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search SKU or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-8 pl-8 pr-3 rounded-lg bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:border-slate-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Minimal Table */}
        <div className="bg-white border border-slate-200/80 rounded-xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar-gray">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 text-slate-500 font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4 sm:px-5">Product</th>
                  <th className="py-3 px-3">SKU</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Price</th>
                  <th className="py-3 px-3">Current Stock</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-4 sm:px-5 text-right">Quick Restock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 sm:px-5">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="size-8.5 rounded-md object-cover border border-slate-200 shrink-0"
                        />
                        <span className="font-semibold text-slate-900">{product.name}</span>
                      </div>
                    </td>

                    <td className="py-3 px-3 font-mono text-slate-500">{product.sku}</td>
                    <td className="py-3 px-3 text-slate-600">{product.category}</td>
                    <td className="py-3 px-3 font-bold text-slate-900">
                      ৳{product.salePrice.toLocaleString()}
                    </td>

                    <td className="py-3 px-3">
                      <span
                        className={`font-bold ${
                          product.stock === 0
                            ? "text-rose-600"
                            : product.stock <= product.lowStockThreshold
                            ? "text-amber-600"
                            : "text-slate-900"
                        }`}
                      >
                        {product.stock} units
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${
                          product.status === "In Stock"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : product.status === "Low Stock"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-rose-50 text-rose-700 border-rose-200"
                        }`}
                      >
                        {product.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 sm:px-5 text-right">
                      <div className="inline-flex items-center gap-1 bg-slate-50 p-0.5 rounded-md border border-slate-200">
                        <button
                          onClick={() => handleStockAdjust(product.id, -1)}
                          className="size-5.5 rounded bg-white hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center transition-colors cursor-pointer"
                          title="Decrease Stock"
                        >
                          <Minus className="size-2.5" />
                        </button>
                        <span className="px-1.5 font-bold text-xs text-slate-900">
                          {product.stock}
                        </span>
                        <button
                          onClick={() => handleStockAdjust(product.id, 5)}
                          className="px-1.5 h-5.5 rounded bg-slate-900 hover:bg-slate-800 text-white font-semibold text-[10px] flex items-center justify-center gap-0.5 transition-colors cursor-pointer"
                          title="Add Stock (+5)"
                        >
                          <Plus className="size-2.5" /> +5
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
