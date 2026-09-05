"use client";

import React, { useState } from "react";
import { Product } from "@/lib/mock-data";
import { useStoreCart } from "@/context/store-cart-context";
import {
  ShoppingBag,
  Heart,
  Star,
  Check,
  Eye,
} from "lucide-react";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, toggleWishlist, isInWishlist } = useStoreCart();
  const [isAdded, setIsAdded] = useState(false);

  const discountAmount = product.regularPrice - product.salePrice;
  const discountPercent = Math.round((discountAmount / product.regularPrice) * 100);
  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="group rounded-2xl bg-white border border-slate-200/80 p-3.5 shadow-2xs hover:border-[#056D6E] hover:shadow-md transition-all flex flex-col justify-between relative">
      {/* Top Badges & Wishlist */}
      <div className="relative overflow-hidden rounded-xl bg-slate-50 border border-slate-100 aspect-square">
        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1">
          {discountPercent > 0 && (
            <span className="bg-rose-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider shadow-2xs">
              -{discountPercent}%
            </span>
          )}
          {product.stock <= 5 && product.stock > 0 && (
            <span className="bg-amber-500 text-slate-900 text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase">
              Low Stock
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={() => toggleWishlist(product)}
          className={`absolute top-2.5 right-2.5 z-10 size-8 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-xs ${
            isWishlisted
              ? "bg-rose-50 text-rose-600"
              : "bg-white/90 text-slate-400 hover:text-rose-500 hover:bg-white"
          }`}
          title="Add to wishlist"
        >
          <Heart className={`size-4 ${isWishlisted ? "fill-current" : ""}`} />
        </button>

        {/* Product Image */}
        <img
          src={product.image}
          alt={product.name}
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Product Info */}
      <div className="mt-3 space-y-1.5">
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span className="font-semibold text-[#056D6E]">{product.category}</span>
          <div className="flex items-center gap-0.5 text-amber-500 font-bold">
            <Star className="size-3 fill-current" />
            <span>4.9</span>
          </div>
        </div>

        <h3 className="font-bold text-xs sm:text-sm text-slate-900 line-clamp-2 leading-snug group-hover:text-[#056D6E] transition-colors">
          {product.name}
        </h3>

        <div className="flex items-baseline gap-2 pt-0.5">
          <span className="text-base font-extrabold text-slate-900 font-sans">
            ৳{product.salePrice.toLocaleString()}
          </span>
          {discountAmount > 0 && (
            <span className="text-xs text-slate-400 line-through">
              ৳{product.regularPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
          className={`w-full mt-2 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            product.stock <= 0
              ? "bg-slate-100 text-slate-400 cursor-not-allowed"
              : isAdded
              ? "bg-emerald-600 text-white"
              : "bg-slate-900 hover:bg-[#056D6E] text-white shadow-xs"
          }`}
        >
          {isAdded ? (
            <>
              <Check className="size-3.5" />
              <span>Added to Cart</span>
            </>
          ) : product.stock <= 0 ? (
            <span>Out of Stock</span>
          ) : (
            <>
              <ShoppingBag className="size-3.5 text-amber-300" />
              <span>Add to Cart</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
