"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useRole } from "@/context/role-context";
import { mockBrands, Brand } from "@/lib/mock-data";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Award,
  Lock,
  X,
  Layers,
  Globe,
} from "lucide-react";

export default function BrandsPage() {
  const { hasManagerAccess, role } = useRole();
  const [brands, setBrands] = useState<Brand[]>(mockBrands);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [origin, setOrigin] = useState("Bangladesh");
  const [description, setDescription] = useState("");
  const [logo, setLogo] = useState("");
  const [status, setStatus] = useState<"Active" | "Disabled">("Active");

  const handleOpenAddModal = () => {
    setEditingBrand(null);
    setName("");
    setSlug("");
    setOrigin("Bangladesh");
    setDescription("");
    setLogo("https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=100&auto=format&fit=crop&q=80");
    setStatus("Active");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (b: Brand) => {
    setEditingBrand(b);
    setName(b.name);
    setSlug(b.slug);
    setOrigin(b.origin);
    setDescription(b.description);
    setLogo(b.logo);
    setStatus(b.status);
    setIsModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingBrand) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
    }
  };

  const handleSaveBrand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug) return;

    if (editingBrand) {
      // Update
      setBrands(
        brands.map((b) =>
          b.id === editingBrand.id
            ? { ...b, name, slug, origin, description, logo, status }
            : b
        )
      );
    } else {
      // Create
      const newBrand: Brand = {
        id: `brd-${Date.now()}`,
        name,
        slug,
        logo: logo || "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=100&auto=format&fit=crop&q=80",
        origin,
        description,
        productCount: 0,
        status,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setBrands([newBrand, ...brands]);
    }

    setIsModalOpen(false);
  };

  const handleDeleteBrand = (id: string) => {
    if (confirm("Are you sure you want to delete this brand?")) {
      setBrands(brands.filter((b) => b.id !== id));
    }
  };

  const toggleBrandStatus = (id: string) => {
    setBrands(
      brands.map((b) =>
        b.id === id ? { ...b, status: b.status === "Active" ? "Disabled" : "Active" } : b
      )
    );
  };

  const filteredBrands = brands.filter(
    (b) =>
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="space-y-4 sm:space-y-5 max-w-full overflow-hidden">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              Brands & Vendors Management
            </h1>
            <p className="text-[11px] sm:text-xs text-slate-500">
              {hasManagerAccess
                ? `Full Brand CRUD access granted (${role})`
                : "Officer Mode: Catalog brands list (Read-only)"}
            </p>
          </div>

          {hasManagerAccess ? (
            <button
              onClick={handleOpenAddModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 shadow-xs transition-all cursor-pointer self-start sm:self-auto"
            >
              <Plus className="size-3.5" />
              <span>Add Brand</span>
            </button>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-semibold self-start sm:self-auto">
              <Lock className="size-3 text-amber-600" />
              <span>Read-Only View</span>
            </div>
          )}
        </div>

        {/* Toolbar */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-2.5 sm:p-3 shadow-xs flex items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search brand name, slug or origin country..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-8.5 pl-9 pr-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none"
            />
          </div>

          <div className="text-xs font-semibold text-slate-500 hidden sm:block">
            Total: {brands.length} Brands
          </div>
        </div>

        {/* Brands Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
          {filteredBrands.map((brand) => (
            <div
              key={brand.id}
              className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all space-y-3.5"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2.5">
                  <div className="flex items-center gap-3">
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className="size-11 rounded-lg object-cover border border-slate-200 shrink-0"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{brand.name}</h4>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Globe className="size-3 text-slate-400" />
                        <span className="text-[11px] text-slate-500 font-medium">{brand.origin}</span>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border shrink-0 ${
                      brand.status === "Active"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-slate-100 text-slate-500 border-slate-200"
                    }`}
                  >
                    {brand.status}
                  </span>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {brand.description || "No description available."}
                </p>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Layers className="size-3.5 text-slate-400" />
                    <span className="font-bold text-slate-900">{brand.productCount}</span> Products
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">/{brand.slug}</span>
                </div>
              </div>

              {/* Action Controls for Admin / Manager */}
              {hasManagerAccess && (
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => toggleBrandStatus(brand.id)}
                    className={`text-[11px] font-semibold px-2 py-1 rounded transition-colors cursor-pointer ${
                      brand.status === "Active"
                        ? "text-slate-500 hover:text-slate-800 bg-slate-50"
                        : "text-emerald-700 hover:bg-emerald-50 bg-emerald-50/50"
                    }`}
                  >
                    {brand.status === "Active" ? "Disable" : "Activate"}
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditModal(brand)}
                      className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
                      title="Edit Brand"
                    >
                      <Edit2 className="size-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteBrand(brand.id)}
                      className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                      title="Delete Brand"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Brand Add/Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
            <div className="bg-white rounded-2xl p-5 sm:p-6 max-w-md w-full shadow-xl space-y-4 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Award className="size-4 text-slate-700" />
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">
                    {editingBrand ? "Edit Brand" : "Add New Brand"}
                  </h3>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="size-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
                >
                  <X className="size-3.5" />
                </button>
              </div>

              <form onSubmit={handleSaveBrand} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Brand Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aarong Heritage"
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="w-full h-8.5 px-3 rounded-lg border border-slate-200 text-xs focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Slug URL *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. aarong-heritage"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      className="w-full h-8.5 px-3 rounded-lg border border-slate-200 font-mono text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Origin Country</label>
                    <input
                      type="text"
                      placeholder="e.g. Bangladesh"
                      value={origin}
                      onChange={(e) => setOrigin(e.target.value)}
                      className="w-full h-8.5 px-3 rounded-lg border border-slate-200 text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Logo URL</label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={logo}
                      onChange={(e) => setLogo(e.target.value)}
                      className="flex-1 h-8.5 px-3 rounded-lg border border-slate-200 text-xs focus:outline-none"
                    />
                    {logo && (
                      <img
                        src={logo}
                        alt="Preview"
                        className="size-8.5 rounded-lg object-cover border border-slate-200 shrink-0"
                      />
                    )}
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Brand Story / Description</label>
                  <textarea
                    rows={2}
                    placeholder="Brand history, values, or target audience..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as "Active" | "Disabled")}
                    className="w-full h-8.5 px-2.5 rounded-lg border border-slate-200 bg-white focus:outline-none"
                  >
                    <option value="Active">Active</option>
                    <option value="Disabled">Disabled</option>
                  </select>
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-2 rounded-lg border border-slate-200 text-slate-700 font-semibold cursor-pointer hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-800 cursor-pointer"
                  >
                    {editingBrand ? "Update Brand" : "Create Brand"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
