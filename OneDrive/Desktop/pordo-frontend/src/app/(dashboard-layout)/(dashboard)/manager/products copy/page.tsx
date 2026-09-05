"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useRole } from "@/context/role-context";
import { mockProducts, mockCategories, mockBrands, Product } from "@/lib/mock-data";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Lock,
  X,
  Tag,
  Award,
} from "lucide-react";

export default function ProductsPage() {
  const { hasManagerAccess, role } = useRole();
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form fields
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Mens Ethnic");
  const [brand, setBrand] = useState("Pordo Atelier");
  const [sku, setSku] = useState("");
  const [regularPrice, setRegularPrice] = useState<number>(2000);
  const [salePrice, setSalePrice] = useState<number>(1800);
  const [stock, setStock] = useState<number>(20);
  const [image, setImage] = useState(
    "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=150&auto=format&fit=crop&q=80"
  );

  const categories = ["All", ...mockCategories.map((c) => c.name)];
  const brands = mockBrands.map((b) => b.name);

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setName("");
    setSku("");
    setCategory("Mens Ethnic");
    setBrand("Pordo Atelier");
    setRegularPrice(2000);
    setSalePrice(1800);
    setStock(20);
    setImage("https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=150&auto=format&fit=crop&q=80");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (prod: Product) => {
    setEditingProduct(prod);
    setName(prod.name);
    setSku(prod.sku);
    setCategory(prod.category);
    setBrand(prod.brand || "Pordo Atelier");
    setRegularPrice(prod.regularPrice);
    setSalePrice(prod.salePrice);
    setStock(prod.stock);
    setImage(prod.image);
    setIsModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !sku) return;

    const statusVal: Product["status"] =
      Number(stock) > 5 ? "In Stock" : Number(stock) > 0 ? "Low Stock" : "Out of Stock";

    if (editingProduct) {
      setProducts(
        products.map((p) =>
          p.id === editingProduct.id
            ? {
                ...p,
                name,
                sku,
                category,
                brand,
                regularPrice: Number(regularPrice),
                salePrice: Number(salePrice),
                stock: Number(stock),
                status: statusVal,
                image,
              }
            : p
        )
      );
    } else {
      const newProd: Product = {
        id: `prod-${Date.now()}`,
        name,
        sku,
        category,
        brand,
        image,
        regularPrice: Number(regularPrice),
        salePrice: Number(salePrice),
        stock: Number(stock),
        lowStockThreshold: 5,
        status: statusVal,
        vendor: brand || "Pordo Atelier",
        sizes: ["M", "L", "XL"],
        colors: ["Standard"],
      };
      setProducts([newProd, ...products]);
    }

    setIsModalOpen(false);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === "All" || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.brand && p.brand.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <DashboardLayout>
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
            <button
              onClick={handleOpenAddModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer shrink-0"
            >
              <Plus className="size-3.5" />
              <span>Add Product</span>
            </button>
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
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium shrink-0 transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-slate-900 text-white font-semibold"
                    : "bg-slate-100/70 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {cat}
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
                  <th className="py-2.5 px-3">SKU</th>
                  <th className="py-2.5 px-3">Brand</th>
                  <th className="py-2.5 px-3">Price</th>
                  <th className="py-2.5 px-3">Stock</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 sm:px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-3 sm:px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="size-8 rounded object-cover border border-slate-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <span className="font-semibold text-slate-900 block leading-tight truncate max-w-[140px] sm:max-w-[200px]">
                            {product.name}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {product.category}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3 font-mono text-slate-500 text-[11px]">{product.sku}</td>
                    <td className="py-3 px-3 text-slate-600 font-medium">
                      {product.brand || product.vendor}
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-900">
                      ৳{product.salePrice.toLocaleString()}
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

                    <td className="py-3 px-3 sm:px-4 text-right">
                      {hasManagerAccess ? (
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenEditModal(product)}
                            className="p-1 rounded hover:bg-slate-100 text-slate-500 cursor-pointer"
                            title="Edit"
                          >
                            <Edit2 className="size-3" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="p-1 rounded hover:bg-rose-50 text-slate-400 hover:text-rose-600 cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="size-3" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-400">
                          {product.stock > 0 ? "In stock" : "Out"}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
            <div className="bg-white rounded-2xl p-5 sm:p-6 max-w-md w-full shadow-xl space-y-3.5 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="size-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 cursor-pointer"
                >
                  <X className="size-3" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Product Title"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-8 px-2.5 rounded-lg border border-slate-200 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full h-8 px-2 rounded-lg border border-slate-200 bg-white focus:outline-none"
                    >
                      {categories.filter((c) => c !== "All").map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Brand</label>
                    <select
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      className="w-full h-8 px-2 rounded-lg border border-slate-200 bg-white focus:outline-none"
                    >
                      {brands.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">SKU *</label>
                    <input
                      type="text"
                      required
                      placeholder="PRD-001"
                      value={sku}
                      onChange={(e) => setSku(e.target.value)}
                      className="w-full h-8 px-2.5 rounded-lg border border-slate-200 uppercase font-mono focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Stock Units</label>
                    <input
                      type="number"
                      value={stock}
                      onChange={(e) => setStock(Number(e.target.value))}
                      className="w-full h-8 px-2 rounded-lg border border-slate-200 focus:outline-none font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Regular Price (৳)</label>
                    <input
                      type="number"
                      value={regularPrice}
                      onChange={(e) => setRegularPrice(Number(e.target.value))}
                      className="w-full h-8 px-2 rounded-lg border border-slate-200 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Sale Price (৳)</label>
                    <input
                      type="number"
                      value={salePrice}
                      onChange={(e) => setSalePrice(Number(e.target.value))}
                      className="w-full h-8 px-2 rounded-lg border border-slate-200 focus:outline-none font-bold text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Image URL</label>
                  <input
                    type="url"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="w-full h-8 px-2.5 rounded-lg border border-slate-200 focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-1.5 rounded-lg border border-slate-200 text-slate-700 font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-1.5 rounded-lg bg-slate-900 text-white font-semibold cursor-pointer"
                  >
                    {editingProduct ? "Update Product" : "Save Product"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
