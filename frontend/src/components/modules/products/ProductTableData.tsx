"use client";

import React, { useState } from "react";
import {
  Edit2,
  Eye,
  Trash2,
  ArrowUpDown,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ProductRow {
  id: string;
  title: string;
  category: string;
  image: string;
  price: number;
  originalPrice?: number;
  costPrice?: number;
  stock: number;
  unit: string;
  status: "ACTIVE" | "DRAFT" | "OUT_OF_STOCK";
  supplier?: string;
  invoiceNo?: string;
}

const initialProducts: ProductRow[] = [
  {
    id: "PRD-01",
    title: "Premium Cotton Slim Fit Shirt",
    category: "Apparel & Menswear",
    image:
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=150&auto=format&fit=crop&q=80",
    price: 1850,
    originalPrice: 2200,
    costPrice: 1200,
    stock: 45,
    unit: "PIECE",
    status: "ACTIVE",
    supplier: "Dhaka Textile Hub",
    invoiceNo: "INV-2026-0041",
  },
  {
    id: "PRD-02",
    title: "Leather Classic Minimalist Wallet",
    category: "Accessories",
    image:
      "https://images.unsplash.com/photo-1627123424574-724758594e93?w=150&auto=format&fit=crop&q=80",
    price: 950,
    originalPrice: 950,
    costPrice: 650,
    stock: 0,
    unit: "PIECE",
    status: "OUT_OF_STOCK",
    supplier: "Apex Tannery",
    invoiceNo: "INV-2026-0089",
  },
  {
    id: "PRD-03",
    title: "Organic Linen Casual Trousers",
    category: "Apparel & Menswear",
    image:
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=150&auto=format&fit=crop&q=80",
    price: 2400,
    originalPrice: 2800,
    costPrice: 1600,
    stock: 12,
    unit: "PIECE",
    status: "DRAFT",
    supplier: "Sourcing Factory BD",
    invoiceNo: "INV-2026-0112",
  },
];

export function ProductTable() {
  const [products, setProducts] = useState<ProductRow[]>(initialProducts);
  const [selectedProduct, setSelectedProduct] = useState<ProductRow | null>(null);
  const [sheetMode, setSheetMode] = useState<"view" | "edit" | null>(null);
  const [productToDelete, setProductToDelete] = useState<ProductRow | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const handleOpenSheet = (product: ProductRow, mode: "view" | "edit") => {
    setSelectedProduct(product);
    setSheetMode(mode);
  };

  const handleCloseSheet = () => {
    setSheetMode(null);
    setSelectedProduct(null);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);

    try {
      // API call বা server mutation এখানে যুক্ত হবে
      await new Promise((resolve) => setTimeout(resolve, 800));
      setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));
      setProductToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusBadge = (status: ProductRow["status"]) => {
    switch (status) {
      case "ACTIVE":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Active
          </span>
        );
      case "OUT_OF_STOCK":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-600 border border-rose-500/20">
            <span className="size-1.5 rounded-full bg-rose-500" />
            Out of Stock
          </span>
        );
      case "DRAFT":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-600 border border-amber-500/20">
            <span className="size-1.5 rounded-full bg-amber-500" />
            Draft
          </span>
        );
    }
  };

  return (
    <div className="w-full bg-white border border-slate-200/90 rounded-3xl shadow-sm overflow-hidden">
      {/* Top Bar */}
      <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Product Catalog
          </h2>
          <p className="text-xs text-slate-500">
            Manage real-time inventory and pricing status
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 text-xs font-semibold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
            Filter
          </button>
          <button className="px-3 py-1.5 text-xs font-bold text-white bg-[#056D6E] hover:bg-[#045859] rounded-xl transition-all shadow-xs">
            Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/70 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <th className="py-3.5 px-5">Product Details</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4">
                <div className="flex items-center gap-1 cursor-pointer hover:text-slate-800">
                  <span>Price</span>
                  <ArrowUpDown className="size-3" />
                </div>
              </th>
              <th className="py-3.5 px-4">Inventory</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {products.map((item) => (
              <tr
                key={item.id}
                className="group hover:bg-teal-50/30 transition-colors duration-150 ease-in-out"
              >
                <td className="py-4 px-5">
                  <div className="flex items-center gap-3.5">
                    <div className="relative size-11 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="min-w-0">
                      <span className="block font-bold text-slate-900 truncate group-hover:text-[#056D6E] transition-colors">
                        {item.title}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {item.id}
                      </span>
                    </div>
                  </div>
                </td>

                <td className="py-4 px-4 text-slate-600 font-medium whitespace-nowrap">
                  {item.category}
                </td>

                <td className="py-4 px-4 whitespace-nowrap">
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-extrabold text-slate-900">
                      ৳{item.price.toLocaleString()}
                    </span>
                    {item.originalPrice && item.originalPrice > item.price && (
                      <span className="text-[10px] text-slate-400 line-through">
                        ৳{item.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </td>

                <td className="py-4 px-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span
                      className={`font-bold ${
                        item.stock <= 5 ? "text-rose-600" : "text-slate-800"
                      }`}
                    >
                      {item.stock} {item.unit.toLowerCase()}(s)
                    </span>
                    <span className="text-[10px] text-slate-400">In Warehouse</span>
                  </div>
                </td>

                <td className="py-4 px-4 whitespace-nowrap">
                  {getStatusBadge(item.status)}
                </td>

                <td className="py-4 px-5 text-right whitespace-nowrap">
                  <div className="inline-flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleOpenSheet(item, "view")}
                      className="size-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-[#056D6E] hover:bg-emerald-50 transition-colors cursor-pointer"
                      title="View Details"
                    >
                      <Eye className="size-4" />
                    </button>
                    <button
                      onClick={() => handleOpenSheet(item, "edit")}
                      className="size-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition-colors cursor-pointer"
                      title="Edit Product"
                    >
                      <Edit2 className="size-4" />
                    </button>
                    <button
                      onClick={() => setProductToDelete(item)}
                      className="size-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="px-5 py-3.5 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>Showing {products.length} of 48 items</span>
        <div className="flex items-center gap-1.5">
          <button className="px-3 py-1 border border-slate-200 bg-white rounded-lg hover:bg-slate-50 font-medium">
            Previous
          </button>
          <button className="px-3 py-1 border border-[#056D6E] bg-[#056D6E] text-white rounded-lg font-bold">
            1
          </button>
          <button className="px-3 py-1 border border-slate-200 bg-white rounded-lg hover:bg-slate-50 font-medium">
            2
          </button>
          <button className="px-3 py-1 border border-slate-200 bg-white rounded-lg hover:bg-slate-50 font-medium">
            Next
          </button>
        </div>
      </div>

      {/* Action Drawer Sheet (View & Edit) */}
      <Sheet open={sheetMode !== null} onOpenChange={(open) => !open && handleCloseSheet()}>
        <SheetContent className="sm:max-w-md w-full p-6 overflow-y-auto">
          {selectedProduct && (
            <>
              {sheetMode === "view" ? (
                <div className="space-y-6">
                  <SheetHeader className="text-left space-y-1">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                      {selectedProduct.id}
                    </span>
                    <SheetTitle className="text-lg font-bold text-slate-900">
                      {selectedProduct.title}
                    </SheetTitle>
                    <SheetDescription className="text-xs text-slate-500">
                      Complete specifications & real-time analytics
                    </SheetDescription>
                  </SheetHeader>

                  <div className="aspect-video w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
                    <img
                      src={selectedProduct.image}
                      alt={selectedProduct.title}
                      className="size-full object-cover"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Selling Price
                      </span>
                      <span className="text-sm font-black text-[#056D6E]">
                        ৳{selectedProduct.price.toLocaleString()}
                      </span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Regular MRP
                      </span>
                      <span className="text-sm font-bold text-slate-700">
                        ৳{(selectedProduct.originalPrice || selectedProduct.price).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-slate-500">Inventory Units:</span>
                      <span className="font-bold text-slate-800">
                        {selectedProduct.stock} {selectedProduct.unit}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-slate-500">Category:</span>
                      <span className="font-semibold text-slate-800">
                        {selectedProduct.category}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-slate-500">Supplier:</span>
                      <span className="font-semibold text-slate-800">
                        {selectedProduct.supplier || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-slate-500">Invoice Reference:</span>
                      <span className="font-mono text-slate-700">
                        {selectedProduct.invoiceNo || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 items-center">
                      <span className="text-slate-500">Visibility Status:</span>
                      <div>{getStatusBadge(selectedProduct.status)}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => setSheetMode("edit")}
                    className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                  >
                    Switch to Edit Mode
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  <SheetHeader className="text-left space-y-1">
                    <SheetTitle className="text-lg font-bold text-slate-900">
                      Quick Edit Product
                    </SheetTitle>
                    <SheetDescription className="text-xs text-slate-500">
                      Modify stock, pricing, and title
                    </SheetDescription>
                  </SheetHeader>

                  <div className="space-y-4 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Product Title
                      </label>
                      <input
                        type="text"
                        defaultValue={selectedProduct.title}
                        className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:bg-white focus:border-[#056D6E] outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Price (৳)
                        </label>
                        <input
                          type="number"
                          defaultValue={selectedProduct.price}
                          className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:bg-white focus:border-[#056D6E] outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Stock Units
                        </label>
                        <input
                          type="number"
                          defaultValue={selectedProduct.stock}
                          className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:bg-white focus:border-[#056D6E] outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Status
                      </label>
                      <select
                        defaultValue={selectedProduct.status}
                        className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:bg-white focus:border-[#056D6E] outline-none"
                      >
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="DRAFT">DRAFT</option>
                        <option value="OUT_OF_STOCK">OUT OF STOCK</option>
                      </select>
                    </div>

                    <div className="pt-2 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleCloseSheet}
                        className="w-1/2 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold hover:bg-slate-50 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          handleCloseSheet();
                        }}
                        className="w-1/2 py-2.5 rounded-xl bg-[#056D6E] hover:bg-[#045657] text-white font-bold cursor-pointer"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog
        open={Boolean(productToDelete)}
        onOpenChange={(open) => !open && setProductToDelete(null)}
      >
        <AlertDialogContent className="max-w-md rounded-2xl p-6 bg-white border border-slate-200 shadow-2xl">
          <AlertDialogHeader className="flex flex-col items-center text-center space-y-3">
            <div className="size-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shadow-2xs">
              <AlertTriangle className="size-6" />
            </div>

            <div className="space-y-1">
              <AlertDialogTitle className="text-lg font-bold text-slate-900 tracking-tight">
                Delete Product?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-xs text-slate-500 leading-relaxed">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-slate-800">
                  &ldquo;{productToDelete?.title}&rdquo;
                </span>
                ? This action is permanent and will remove all stock, pricing, and
                media data from the system.
              </AlertDialogDescription>
            </div>
          </AlertDialogHeader>

          <AlertDialogFooter className="grid grid-cols-2 gap-2.5 sm:gap-2.5 pt-3">
            <AlertDialogCancel
              disabled={isDeleting}
              onClick={() => setProductToDelete(null)}
              className="w-full h-10 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              disabled={isDeleting}
              onClick={(e) => {
                e.preventDefault();
                handleDeleteConfirm();
              }}
              className="w-full h-10 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                <span>Delete Permanently</span>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}