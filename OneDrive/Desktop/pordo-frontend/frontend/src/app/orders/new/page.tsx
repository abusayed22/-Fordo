"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { mockProducts, mockCustomers, mockCoupons, Product, OrderItem } from "@/lib/mock-data";
import {
  Search,
  User,
  Phone,
  Package,
  Plus,
  Minus,
  Trash2,
  TicketPercent,
  CheckCircle2,
  Printer,
  X,
} from "lucide-react";

export default function NewManualOrderPage() {
  // Customer Form State
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [altPhone, setAltPhone] = useState("");
  const [deliveryZone, setDeliveryZone] = useState<"Inside Dhaka" | "Outside Dhaka">("Inside Dhaka");
  const [address, setAddress] = useState("");
  const [district, setDistrict] = useState("Dhaka");
  const [orderNote, setOrderNote] = useState("");

  // Cart / Items State
  const [selectedItems, setSelectedItems] = useState<OrderItem[]>([]);
  const [productSearch, setProductSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Discount & Payment
  const [couponCode, setCouponCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [discountMessage, setDiscountMessage] = useState("");
  const [advancePaid, setAdvancePaid] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "bKash" | "Nagad">("COD");

  // Success Modal
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [createdOrderNumber, setCreatedOrderNumber] = useState("");

  // Phone Lookup
  const handlePhoneLookup = (phone: string) => {
    setCustomerPhone(phone);
    const matched = mockCustomers.find(
      (c) => c.phone.includes(phone) || (phone.length >= 4 && c.phone.endsWith(phone))
    );
    if (matched) {
      setCustomerName(matched.name);
      setAddress(matched.address);
      setDistrict(matched.district);
      setDeliveryZone(matched.district.toLowerCase() === "dhaka" ? "Inside Dhaka" : "Outside Dhaka");
    }
  };

  // Add Product to Cart
  const handleAddProduct = (product: Product) => {
    if (product.stock <= 0) return;
    const existing = selectedItems.find((item) => item.id === product.id);
    if (existing) {
      if (existing.quantity < product.stock) {
        setSelectedItems(
          selectedItems.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          )
        );
      }
    } else {
      setSelectedItems([
        ...selectedItems,
        {
          id: product.id,
          name: product.name,
          image: product.image,
          price: product.salePrice,
          quantity: 1,
          sku: product.sku,
          size: product.sizes[0] || "Standard",
          color: product.colors[0] || "Standard",
        },
      ]);
    }
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    const item = selectedItems.find((i) => i.id === id);
    const prod = mockProducts.find((p) => p.id === id);
    if (!item || !prod) return;

    const newQty = item.quantity + delta;
    if (newQty <= 0) {
      setSelectedItems(selectedItems.filter((i) => i.id !== id));
    } else if (newQty <= prod.stock) {
      setSelectedItems(
        selectedItems.map((i) => (i.id === id ? { ...i, quantity: newQty } : i))
      );
    }
  };

  const handleRemoveItem = (id: string) => {
    setSelectedItems(selectedItems.filter((i) => i.id !== id));
  };

  // Apply Coupon
  const handleApplyCoupon = () => {
    const coupon = mockCoupons.find(
      (c) => c.code.toLowerCase() === couponCode.trim().toLowerCase() && c.status === "Active"
    );
    if (!coupon) {
      setDiscountMessage("❌ Invalid or expired coupon code");
      setAppliedDiscount(0);
      return;
    }
    const sub = selectedItems.reduce((acc, i) => acc + i.price * i.quantity, 0);
    if (sub < coupon.minOrder) {
      setDiscountMessage(`❌ Minimum order ৳${coupon.minOrder} required for ${coupon.code}`);
      setAppliedDiscount(0);
      return;
    }

    let disc = 0;
    if (coupon.type === "Percentage") {
      disc = Math.round((sub * coupon.value) / 100);
      if (coupon.maxDiscount && disc > coupon.maxDiscount) {
        disc = coupon.maxDiscount;
      }
    } else {
      disc = coupon.value;
    }
    setAppliedDiscount(disc);
    setDiscountMessage(`✅ Promo applied: ৳${disc} discount`);
  };

  // Financial Calculations
  const subtotal = selectedItems.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const deliveryFee = deliveryZone === "Inside Dhaka" ? 80 : 150;
  const grandTotal = Math.max(0, subtotal + deliveryFee - appliedDiscount);
  const dueAmount = Math.max(0, grandTotal - (advancePaid || 0));

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerPhone || !customerName || !address) {
      alert("Please fill in Customer Name, Phone, and Delivery Address.");
      return;
    }
    if (selectedItems.length === 0) {
      alert("Please add at least one product to the order.");
      return;
    }

    const orderNum = `#254${Math.floor(100 + Math.random() * 900)}`;
    setCreatedOrderNumber(orderNum);
    setIsSuccessModalOpen(true);
  };

  const handleResetForm = () => {
    setCustomerName("");
    setCustomerPhone("");
    setAddress("");
    setDistrict("Dhaka");
    setSelectedItems([]);
    setCouponCode("");
    setAppliedDiscount(0);
    setAdvancePaid(0);
    setOrderNote("");
    setIsSuccessModalOpen(false);
  };

  const categories = ["All", "Mens Ethnic", "Womens Wear", "Saree", "Mens Formal", "Modest Wear", "Mens Casual"];
  const filteredProducts = mockProducts.filter((p) => {
    const matchesCat = selectedCategory === "All" || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.sku.toLowerCase().includes(productSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* Page Title */}
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            New Order Entry (Manual POS)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Quick manual order entry for phone and inbox customers
          </p>
        </div>

        <form onSubmit={handleCreateOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column: Customer Details & Product Selection (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            {/* 1. Customer Phone Auto-Search & Info */}
            <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  1. Customer Details
                </span>
                <span className="text-[11px] text-slate-400">
                  Instant phone auto-fill
                </span>
              </div>

              {/* Phone Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Customer Phone *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
                  <input
                    type="tel"
                    placeholder="e.g. 01711223344"
                    value={customerPhone}
                    onChange={(e) => handlePhoneLookup(e.target.value)}
                    required
                    className="w-full h-9 pl-9 pr-3 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono font-semibold text-slate-900 focus:bg-white focus:border-slate-400 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs focus:border-slate-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Alternate Phone
                  </label>
                  <input
                    type="tel"
                    placeholder="Optional backup number"
                    value={altPhone}
                    onChange={(e) => setAltPhone(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs focus:border-slate-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Delivery Zone Toggle */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Delivery Area
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setDeliveryZone("Inside Dhaka")}
                    className={`flex items-center justify-between p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                      deliveryZone === "Inside Dhaka"
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <div>
                      <span className="font-semibold text-xs block">Inside Dhaka</span>
                      <span className={`text-[10px] ${deliveryZone === "Inside Dhaka" ? "text-slate-300" : "text-slate-400"}`}>
                        Metro Area
                      </span>
                    </div>
                    <span className="font-bold text-xs">৳80</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryZone("Outside Dhaka")}
                    className={`flex items-center justify-between p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                      deliveryZone === "Outside Dhaka"
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <div>
                      <span className="font-semibold text-xs block">Outside Dhaka</span>
                      <span className={`text-[10px] ${deliveryZone === "Outside Dhaka" ? "text-slate-300" : "text-slate-400"}`}>
                        All Districts
                      </span>
                    </div>
                    <span className="font-bold text-xs">৳150</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Address *
                  </label>
                  <input
                    type="text"
                    placeholder="House, Road, Area"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs focus:border-slate-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    District
                  </label>
                  <input
                    type="text"
                    placeholder="District"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs focus:border-slate-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Order Note (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Special instructions or timing"
                  value={orderNote}
                  onChange={(e) => setOrderNote(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs focus:border-slate-400 focus:outline-none"
                />
              </div>
            </div>

            {/* 2. Product Selector */}
            <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  2. Select Products
                </span>
                <span className="text-[11px] text-emerald-600 font-medium">
                  Live Stock Sync
                </span>
              </div>

              {/* Filter */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search product or SKU..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full h-8.5 pl-8.5 pr-3 rounded-lg bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:border-slate-400 focus:outline-none"
                  />
                </div>

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="h-8.5 px-2.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-medium text-slate-700 focus:outline-none"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[320px] overflow-y-auto custom-scrollbar-gray pr-1">
                {filteredProducts.map((product) => {
                  const isOutOfStock = product.stock <= 0;
                  return (
                    <div
                      key={product.id}
                      className={`p-2.5 rounded-lg border flex items-center justify-between gap-2.5 transition-all ${
                        isOutOfStock
                          ? "opacity-50 border-slate-200 bg-slate-50"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="size-10 rounded-md object-cover border border-slate-100 shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="text-xs font-semibold text-slate-900 truncate">
                            {product.name}
                          </h4>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs font-bold text-slate-900">
                              ৳{product.salePrice}
                            </span>
                            <span className="text-[10px] text-slate-400 line-through">
                              ৳{product.regularPrice}
                            </span>
                          </div>
                          <span
                            className={`text-[10px] font-medium ${
                              isOutOfStock
                                ? "text-rose-600"
                                : product.stock < 5
                                ? "text-amber-600"
                                : "text-emerald-600"
                            }`}
                          >
                            {isOutOfStock ? "Out of Stock" : `Stock: ${product.stock}`}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        disabled={isOutOfStock}
                        onClick={() => handleAddProduct(product)}
                        className={`size-7 rounded-md flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                          isOutOfStock
                            ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                            : "bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-700"
                        }`}
                        title="Add item"
                      >
                        <Plus className="size-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Place Order (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs sticky top-20 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  Order Invoice
                </h3>
                <span className="text-[11px] font-semibold text-slate-500">
                  {selectedItems.length} items
                </span>
              </div>

              {/* Items in Cart */}
              {selectedItems.length === 0 ? (
                <div className="py-8 text-center border border-dashed border-slate-200 rounded-lg">
                  <Package className="size-6 text-slate-300 mx-auto mb-1" />
                  <p className="text-xs text-slate-400">No items selected</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar-gray pr-1">
                  {selectedItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-2.5 rounded-lg bg-slate-50/70 border border-slate-100 flex items-center justify-between gap-2 text-xs"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-slate-900 truncate">
                          {item.name}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          ৳{item.price} × {item.quantity} ={" "}
                          <span className="font-bold text-slate-900">
                            ৳{item.price * item.quantity}
                          </span>
                        </p>
                      </div>

                      {/* Quantity Modifier */}
                      <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-md p-0.5">
                        <button
                          type="button"
                          onClick={() => handleUpdateQuantity(item.id, -1)}
                          className="size-5 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded cursor-pointer"
                        >
                          <Minus className="size-2.5" />
                        </button>
                        <span className="w-4 text-center text-xs font-bold text-slate-900">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleUpdateQuantity(item.id, 1)}
                          className="size-5 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded cursor-pointer"
                        >
                          <Plus className="size-2.5" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Coupon */}
              <div className="pt-2 border-t border-slate-100">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <TicketPercent className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Promo Code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="w-full h-8 pl-8 pr-2 rounded-lg border border-slate-200 text-xs font-mono uppercase focus:border-slate-400 focus:outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="px-3 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
                {discountMessage && (
                  <p className="text-[11px] font-medium mt-1 text-emerald-600">
                    {discountMessage}
                  </p>
                )}
              </div>

              {/* Payment & Advance */}
              <div className="space-y-2.5 pt-2 border-t border-slate-100">
                <div>
                  <span className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
                    Payment Method
                  </span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(["COD", "bKash", "Nagad"] as const).map((method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setPaymentMethod(method)}
                        className={`py-1.5 rounded-lg text-xs font-semibold border text-center cursor-pointer transition-all ${
                          paymentMethod === method
                            ? "bg-slate-900 border-slate-900 text-white"
                            : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
                    Advance Payment (৳)
                  </span>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={advancePaid || ""}
                    onChange={(e) => setAdvancePaid(Number(e.target.value) || 0)}
                    className="w-full h-8 px-2.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-900 focus:border-slate-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Calculation Summary */}
              <div className="pt-2.5 border-t border-slate-100 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">৳{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Delivery ({deliveryZone})</span>
                  <span className="font-semibold text-slate-900">৳{deliveryFee}</span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount</span>
                    <span>- ৳{appliedDiscount}</span>
                  </div>
                )}
                {advancePaid > 0 && (
                  <div className="flex justify-between text-blue-600 font-semibold">
                    <span>Advance</span>
                    <span>- ৳{advancePaid}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-sm">
                  <span className="font-bold text-slate-900">Total Due (COD)</span>
                  <span className="text-lg font-bold text-slate-900">
                    ৳{dueAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Confirm Order Button */}
              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all"
              >
                <CheckCircle2 className="size-4" />
                <span>Place Order</span>
              </button>
            </div>
          </div>
        </form>

        {/* Minimal Order Success Modal */}
        {isSuccessModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl text-center space-y-4 animate-in zoom-in-95">
              <div className="size-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="size-7" />
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Order {createdOrderNumber} Placed
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Order is queued for fulfillment and courier dispatch.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-left text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Customer:</span>
                  <span className="font-semibold text-slate-900">{customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Phone:</span>
                  <span className="font-mono text-slate-900">{customerPhone}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-200 font-bold">
                  <span>Due (COD):</span>
                  <span className="text-slate-900">৳{dueAmount.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="flex-1 py-2 rounded-lg bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-all cursor-pointer"
                >
                  New Order
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex items-center justify-center gap-1 px-3 py-2 rounded-lg border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-all cursor-pointer"
                >
                  <Printer className="size-3.5" /> Print
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
