"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useRole } from "@/context/role-context";
import { AccessDenied } from "@/components/common/access-denied";
import { mockCoupons, Coupon } from "@/lib/mock-data";
import {
  Plus,
  Copy,
  Check,
  X,
} from "lucide-react";

export default function DiscountsPage() {
  const { hasManagerAccess, role } = useRole();
  const [coupons, setCoupons] = useState<Coupon[]>(mockCoupons);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // New Coupon Form
  const [newCode, setNewCode] = useState("");
  const [newType, setNewType] = useState<"Percentage" | "Fixed">("Percentage");
  const [newValue, setNewValue] = useState<number>(10);
  const [newMinOrder, setNewMinOrder] = useState<number>(1000);
  const [newMaxDiscount, setNewMaxDiscount] = useState<number>(500);
  const [newUsageLimit, setNewUsageLimit] = useState<number>(200);
  const [newEndDate, setNewEndDate] = useState("2026-12-31");

  if (!hasManagerAccess) {
    return (
      <div>
        <AccessDenied pageTitle="Coupons & Promotional Discounts" allowedRoles={["ADMIN", "MANAGER"]} />
      </div>
    );
  }

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode) return;

    const coupon: Coupon = {
      id: `cp-${Date.now()}`,
      code: newCode.toUpperCase().trim(),
      type: newType,
      value: Number(newValue),
      minOrder: Number(newMinOrder),
      maxDiscount: newType === "Percentage" ? Number(newMaxDiscount) : undefined,
      usageCount: 0,
      usageLimit: Number(newUsageLimit),
      startDate: "2026-09-02",
      endDate: newEndDate,
      status: "Active",
    };

    setCoupons([coupon, ...coupons]);
    setIsModalOpen(false);
    setNewCode("");
  };

  const toggleCouponStatus = (id: string) => {
    setCoupons(
      coupons.map((c) => {
        if (c.id !== id) return c;
        const nextStatus = c.status === "Active" ? "Disabled" : "Active";
        return { ...c, status: nextStatus };
      })
    );
  };

  return (
    <div>
      <div className="space-y-5">
        {/* Page Header */}
        

        {/* Minimal Coupons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {coupons.map((coupon) => (
            <div
              key={coupon.id}
              className="bg-white border border-slate-200/80 rounded-xl p-4.5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all space-y-3.5"
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 block uppercase">
                      {coupon.type} Discount
                    </span>
                    <span className="text-base font-bold text-slate-900">
                      {coupon.type === "Percentage" ? `${coupon.value}% OFF` : `৳${coupon.value} Flat`}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${
                      coupon.status === "Active"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-slate-50 text-slate-500 border-slate-200"
                    }`}
                  >
                    {coupon.status}
                  </span>
                </div>

                {/* Code Pill */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200/60 font-mono text-xs">
                  <span className="font-bold text-slate-900 tracking-wider">
                    {coupon.code}
                  </span>
                  <button
                    onClick={() => handleCopy(coupon.code)}
                    className="p-1 text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
                    title="Copy code"
                  >
                    {copiedCode === coupon.code ? (
                      <Check className="size-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="size-3.5" />
                    )}
                  </button>
                </div>

                {/* Details */}
                <div className="space-y-1 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Min Order:</span>
                    <span className="font-semibold text-slate-900">৳{coupon.minOrder}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Usage:</span>
                    <span className="font-semibold text-slate-900">
                      {coupon.usageCount} / {coupon.usageLimit}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Expiry:</span>
                    <span className="font-semibold text-slate-900">{coupon.endDate}</span>
                  </div>
                </div>

                {/* Minimal Progress */}
                <div className="w-full h-1 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-slate-900 rounded-full"
                    style={{
                      width: `${Math.min(100, (coupon.usageCount / coupon.usageLimit) * 100)}%`,
                    }}
                  />
                </div>
              </div>

              {/* Action */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400">Status Toggle</span>
                <button
                  onClick={() => toggleCouponStatus(coupon.id)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                    coupon.status === "Active"
                      ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                  }`}
                >
                  {coupon.status === "Active" ? "Deactivate" : "Activate"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Create Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl space-y-4 animate-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">New Coupon Code</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="size-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
                >
                  <X className="size-3.5" />
                </button>
              </div>

              <form onSubmit={handleAddCoupon} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Coupon Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. FLASH20"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    className="w-full h-8.5 px-3 rounded-lg border border-slate-200 font-mono uppercase font-bold focus:border-slate-400 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Type</label>
                    <select
                      value={newType}
                      onChange={(e) => setNewType(e.target.value as "Percentage" | "Fixed")}
                      className="w-full h-8.5 px-2.5 rounded-lg border border-slate-200 bg-white focus:outline-none"
                    >
                      <option value="Percentage">Percent (%)</option>
                      <option value="Fixed">Fixed (৳)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Value</label>
                    <input
                      type="number"
                      required
                      value={newValue}
                      onChange={(e) => setNewValue(Number(e.target.value))}
                      className="w-full h-8.5 px-2.5 rounded-lg border border-slate-200 font-bold focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Min Spend (৳)</label>
                    <input
                      type="number"
                      value={newMinOrder}
                      onChange={(e) => setNewMinOrder(Number(e.target.value))}
                      className="w-full h-8.5 px-2.5 rounded-lg border border-slate-200 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Max Uses</label>
                    <input
                      type="number"
                      value={newUsageLimit}
                      onChange={(e) => setNewUsageLimit(Number(e.target.value))}
                      className="w-full h-8.5 px-2.5 rounded-lg border border-slate-200 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={newEndDate}
                    onChange={(e) => setNewEndDate(e.target.value)}
                    className="w-full h-8.5 px-2.5 rounded-lg border border-slate-200 focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-2 rounded-lg border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-800 cursor-pointer"
                  >
                    Create
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
