"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { getProductsData } from "@/services/product.service";
import { getBrandsData } from "@/services/brand.service";
import { getCategoriesData } from "@/services/categories.service";
import {
  Search,
  Plus,
  Lock,
} from "lucide-react";

export default function ProductsMainComp() {
  const hasManagerAccess = true;
  const role = "ADMIN";
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const { data: productsResponse, isLoading, isError } = useQuery({
    queryKey: ["admin-products"],
    queryFn: getProductsData,
    staleTime: 30_000,
  });
  const { data: categoriesResponse } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: getCategoriesData,
    staleTime: 30_000,
  });
  const { data: brandsResponse } = useQuery({
    queryKey: ["admin-brands"],
    queryFn: getBrandsData,
    staleTime: 30_000,
  });
  const products = Array.isArray(productsResponse?.data?.data)
    ? productsResponse.data.data
    : [];
  const categoriesData = Array.isArray(categoriesResponse?.data)
    ? categoriesResponse.data.filter((category) => !category.isDeleted)
    : [];
  const brandsData = Array.isArray(brandsResponse?.data) ? brandsResponse.data : [];
  const categoryById = new Map(categoriesData.map((category) => [category.id, category]));
  const brandById = new Map(brandsData.map((brand) => [brand.id, brand]));

  const categories = [
    { id: "All", name: "All" },
    ...Array.from(
      new Map(
        products.map((product) => [
          product.categoryId,
          {
            id: product.categoryId,
            name: categoryById.get(product.categoryId)?.name || product.categoryId,
          },
        ])
      ).values()
    ),
  ];

  const filteredProducts = products.filter((product) => {
    const category = categoryById.get(product.categoryId);
    const brand = brandById.get(product.brandId);
    const matchesCat = selectedCategory === "All" || product.categoryId === selectedCategory;
    const matchesSearch =
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (category?.name || product.categoryId).toLowerCase().includes(searchQuery.toLowerCase()) ||
      (brand?.name || product.brandId).toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });
  return (
    <div>
      <div className="space-y-4 sm:space-y-5 max-w-full overflow-hidden">
        {/* Page Header */}
        <div className="flex items-center justify-between gap-2">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              Products Catalog
            </h1>
            <p className="text-[11px] sm:text-xs text-slate-500">
              {hasManagerAccess
                ? `Full Product & Catalog CRUD Access (${role})`
                : "Officer Mode: Live Stock & Price Check (Read-only)"}
            </p>
          </div>

          {hasManagerAccess ? (
            <Link
              href="/admin/product/new"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer shrink-0"
            >
              <Plus className="size-3.5" />
              <span>Add Product</span>
            </Link>
          ) : (
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-semibold shrink-0">
              <Lock className="size-3 text-amber-600" />
              <span>Read-Only</span>
            </div>
          )}
        </div>

        {/* Toolbar */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-2.5 sm:p-3 shadow-xs space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search product name, SKU or brand..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-8 pl-8 pr-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar-gray pb-0.5">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium shrink-0 transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-slate-900 text-white font-semibold"
                    : "bg-slate-100/70 text-slate-600 hover:bg-slate-100"
                }`}
              >
                  {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Minimal Table */}
        <div className="bg-white border border-slate-200/80 rounded-xl shadow-xs overflow-hidden max-w-full">
          <div className="overflow-x-auto custom-scrollbar-gray w-full">
            <table className="w-full text-left text-xs min-w-[540px]">
              <thead className="bg-slate-50/70 text-slate-500 font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-2.5 px-3 sm:px-4">Product</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Brand</th>
                  <th className="py-2.5 px-3">Price</th>
                  <th className="py-2.5 px-3">Stock</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-slate-400">
                      Loading products...
                    </td>
                  </tr>
                ) : isError ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-rose-500">
                      Unable to load products.
                    </td>
                  </tr>
                ) : filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-slate-400">
                      No products found.
                    </td>
                  </tr>
                ) : filteredProducts.map((product, index) => (
                  <tr key={`${product.title}-${index}`} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-3 sm:px-4">
                      <div className="flex items-center gap-2.5">
                        <span className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                          <Image
                            src={product.images?.[0].url || "/placeholder-product.jpg"}
                            alt={product.title}
                            fill
                            sizes="48px"
                            className="object-contain p-1"
                          />
                        </span>
                        <div className="min-w-0">
                          <span className="font-semibold text-slate-900 block leading-tight truncate max-w-[140px] sm:max-w-[200px]">
                            {product.title}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {product.unitType}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      {(() => {
                        const category = categoryById.get(product.categoryId);
                        return (
                          <div className="flex items-center gap-2">
                            {category?.logo ? (
                              <Image
                                src={category.logo}
                                alt=""
                                width={50}
                                height={50}
                                className="size-7 rounded-lg object-cover border border-slate-200"
                              />
                            ) : (
                              <span className="size-7 rounded-lg bg-slate-100" />
                            )}
                            <span className="font-medium text-slate-600">
                              {category?.name || product.categoryId}
                            </span>
                          </div>
                        );
                      })()}
                    </td>
                    <td className="py-3 px-3 align-middle">
                      {brandById.get(product.brandId)?.logo ? (
                        <span className="flex size-9 items-center justify-center">
                          <span className="flex size-8 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-white">
                            <Image
                              src={brandById.get(product.brandId)?.logo}
                              alt=""
                              width={32}
                              height={32}
                              className="size-full object-contain p-1"
                            />
                          </span>
                        </span>
                      ) : (
                        <span className="flex size-9 items-center justify-center">
                          <span className="size-8 rounded-lg border border-slate-200 bg-slate-100" />
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-900">
                      ৳{product.sellingPrice.toLocaleString()}
                    </td>

                    <td className="py-3 px-3">
                      <span
                        className={`font-bold ${
                          product.stock <= 0
                            ? "text-rose-600"
                            : product.stock < 5
                            ? "text-amber-600"
                            : "text-slate-900"
                        }`}
                      >
                        {product.stock}
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <span
                        className={`text-[10px] font-semibold px-1.5 py-0.2 rounded border ${
                          product.isAvailable && product.stock > 5
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : product.stock > 0
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-rose-50 text-rose-700 border-rose-200"
                        }`}
                      >
                        {product.stock <= 0 ? "Out of Stock" : product.stock > 5 ? "In Stock" : "Low Stock"}
                      </span>
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
