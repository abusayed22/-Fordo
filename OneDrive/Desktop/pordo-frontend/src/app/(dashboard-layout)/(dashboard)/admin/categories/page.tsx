"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useRole } from "@/context/role-context";
import { mockCategories, Category } from "@/lib/mock-data";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  FolderTree,
  Lock,
  X,
  Layers,
  Image as ImageIcon,
} from "lucide-react";

export default function CategoriesPage() {
  const { hasManagerAccess, role } = useRole();
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [status, setStatus] = useState<"Active" | "Disabled">("Active");

  const handleOpenAddModal = () => {
    setEditingCategory(null);
    setName("");
    setSlug("");
    setDescription("");
    setImage("https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=150&auto=format&fit=crop&q=80");
    setStatus("Active");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description);
    setImage(cat.image);
    setStatus(cat.status);
    setIsModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingCategory) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
    }
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug) return;

    if (editingCategory) {
      // Update
      setCategories(
        categories.map((c) =>
          c.id === editingCategory.id
            ? { ...c, name, slug, description, image, status }
            : c
        )
      );
    } else {
      // Create
      const newCat: Category = {
        id: `cat-${Date.now()}`,
        name,
        slug,
        image: image || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=150&auto=format&fit=crop&q=80",
        description,
        productCount: 0,
        status,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setCategories([newCat, ...categories]);
    }

    setIsModalOpen(false);
  };

  const handleDeleteCategory = (id: string) => {
    if (confirm("Are you sure you want to delete this category? Products in this category will become unassigned.")) {
      setCategories(categories.filter((c) => c.id !== id));
    }
  };

  const toggleCategoryStatus = (id: string) => {
    setCategories(
      categories.map((c) =>
        c.id === id ? { ...c, status: c.status === "Active" ? "Disabled" : "Active" } : c
      )
    );
  };

  const filteredCategories = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="space-y-4 sm:space-y-5 max-w-full overflow-hidden">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              Categories Management
            </h1>
            <p className="text-[11px] sm:text-xs text-slate-500">
              {hasManagerAccess
                ? `Full Category CRUD access granted (${role})`
                : "Officer Mode: Catalog categories list (Read-only)"}
            </p>
          </div>

          {hasManagerAccess ? (
            <button
              onClick={handleOpenAddModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 shadow-xs transition-all cursor-pointer self-start sm:self-auto"
            >
              <Plus className="size-3.5" />
              <span>Add Category</span>
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
              placeholder="Search category name or slug..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-8.5 pl-9 pr-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none"
            />
          </div>

          <div className="text-xs font-semibold text-slate-500 hidden sm:block">
            Total: {categories.length} Categories
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
          {filteredCategories.map((category) => (
            <div
              key={category.id}
              className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all space-y-3.5"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2.5">
                  <div className="flex items-center gap-3">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="size-11 rounded-lg object-cover border border-slate-200 shrink-0"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{category.name}</h4>
                      <span className="font-mono text-[10px] text-slate-400 block mt-0.5">
                        /{category.slug}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border shrink-0 ${
                      category.status === "Active"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-slate-100 text-slate-500 border-slate-200"
                    }`}
                  >
                    {category.status}
                  </span>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {category.description || "No description provided."}
                </p>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Layers className="size-3.5 text-slate-400" />
                    <span className="font-bold text-slate-900">{category.productCount}</span> Products
                  </div>
                  <span className="text-[10px] text-slate-400">Created {category.createdAt}</span>
                </div>
              </div>

              {/* Action Controls for Admin / Manager */}
              {hasManagerAccess && (
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => toggleCategoryStatus(category.id)}
                    className={`text-[11px] font-semibold px-2 py-1 rounded transition-colors cursor-pointer ${
                      category.status === "Active"
                        ? "text-slate-500 hover:text-slate-800 bg-slate-50"
                        : "text-emerald-700 hover:bg-emerald-50 bg-emerald-50/50"
                    }`}
                  >
                    {category.status === "Active" ? "Disable" : "Activate"}
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditModal(category)}
                      className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
                      title="Edit Category"
                    >
                      <Edit2 className="size-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                      title="Delete Category"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Category Add/Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
            <div className="bg-white rounded-2xl p-5 sm:p-6 max-w-md w-full shadow-xl space-y-4 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <FolderTree className="size-4 text-slate-700" />
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">
                    {editingCategory ? "Edit Category" : "Add New Category"}
                  </h3>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="size-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
                >
                  <X className="size-3.5" />
                </button>
              </div>

              <form onSubmit={handleSaveCategory} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mens Ethnic Wear"
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="w-full h-8.5 px-3 rounded-lg border border-slate-200 text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Slug URL *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. mens-ethnic-wear"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full h-8.5 px-3 rounded-lg border border-slate-200 font-mono text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Image URL</label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      className="flex-1 h-8.5 px-3 rounded-lg border border-slate-200 text-xs focus:outline-none"
                    />
                    {image && (
                      <img
                        src={image}
                        alt="Preview"
                        className="size-8.5 rounded-lg object-cover border border-slate-200 shrink-0"
                      />
                    )}
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Description</label>
                  <textarea
                    rows={2}
                    placeholder="Short description for SEO and catalog..."
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
                    {editingCategory ? "Update Category" : "Create Category"}
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
