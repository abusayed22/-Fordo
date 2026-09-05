"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useRole } from "@/context/role-context";
import { AccessDenied } from "@/components/common/access-denied";
import { initialSettings } from "@/lib/mock-data";
import {
  Truck,
  CreditCard,
  Store,
  KeyRound,
  CheckCircle2,
  Save,
} from "lucide-react";

export default function SettingsPage() {
  const { isAdmin } = useRole();
  const [settings, setSettings] = useState(initialSettings);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<"delivery" | "payment" | "courier" | "store">("delivery");

  if (!isAdmin) {
    return (
      <DashboardLayout>
        <AccessDenied pageTitle="Store & Delivery Settings" allowedRoles={["ADMIN"]} />
      </DashboardLayout>
    );
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Settings & Configuration
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Delivery fees, courier integration, MFS payment wallets and store profile
            </p>
          </div>

          {savedSuccess && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
              <CheckCircle2 className="size-3.5 text-emerald-600" />
              <span>Saved successfully</span>
            </div>
          )}
        </div>

        {/* Minimal Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar-gray pb-0.5">
          <button
            onClick={() => setActiveTab("delivery")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeTab === "delivery"
                ? "bg-slate-900 text-white font-semibold"
                : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            <Truck className="size-3.5" />
            <span>Delivery Fees</span>
          </button>

          <button
            onClick={() => setActiveTab("payment")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeTab === "payment"
                ? "bg-slate-900 text-white font-semibold"
                : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            <CreditCard className="size-3.5" />
            <span>Payment Methods</span>
          </button>

          <button
            onClick={() => setActiveTab("courier")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeTab === "courier"
                ? "bg-slate-900 text-white font-semibold"
                : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            <KeyRound className="size-3.5" />
            <span>Courier API</span>
          </button>

          <button
            onClick={() => setActiveTab("store")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeTab === "store"
                ? "bg-slate-900 text-white font-semibold"
                : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            <Store className="size-3.5" />
            <span>Store Profile</span>
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          {/* TAB 1: Delivery Charges */}
          {activeTab === "delivery" && (
            <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  Standard Delivery Charges
                </h3>
                <p className="text-xs text-slate-400">
                  Default automated shipping cost for Dhaka metro and outside districts.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-slate-900">Inside Dhaka (মেট্রো)</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                      Standard
                    </span>
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">
                      Delivery Charge (৳)
                    </label>
                    <input
                      type="number"
                      required
                      value={settings.insideDhakaFee}
                      onChange={(e) =>
                        setSettings({ ...settings, insideDhakaFee: Number(e.target.value) })
                      }
                      className="w-full h-9 px-3 rounded-lg border border-slate-200 font-bold text-sm text-slate-900 focus:outline-none focus:border-slate-400"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-slate-900">Outside Dhaka (সমগ্র বাংলাদেশ)</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                      All Districts
                    </span>
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">
                      Delivery Charge (৳)
                    </label>
                    <input
                      type="number"
                      required
                      value={settings.outsideDhakaFee}
                      onChange={(e) =>
                        setSettings({ ...settings, outsideDhakaFee: Number(e.target.value) })
                      }
                      className="w-full h-9 px-3 rounded-lg border border-slate-200 font-bold text-sm text-slate-900 focus:outline-none focus:border-slate-400"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Payment Methods */}
          {activeTab === "payment" && (
            <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  Payment Methods
                </h3>
                <p className="text-xs text-slate-400">
                  Configure Cash on Delivery and bKash / Nagad merchant wallets.
                </p>
              </div>

              <div className="space-y-3">
                {/* COD */}
                <div className="p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-xs text-slate-900 block">Cash On Delivery (COD)</span>
                    <span className="text-[11px] text-slate-400">Customer pays upon receiving package</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.codEnabled}
                    onChange={(e) => setSettings({ ...settings, codEnabled: e.target.checked })}
                    className="size-4 accent-slate-900 cursor-pointer"
                  />
                </div>

                {/* bKash */}
                <div className="p-3.5 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-slate-900">bKash Merchant / Personal</span>
                    <input
                      type="checkbox"
                      checked={settings.bkashEnabled}
                      onChange={(e) => setSettings({ ...settings, bkashEnabled: e.target.checked })}
                      className="size-4 accent-slate-900 cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">
                      Wallet Number
                    </label>
                    <input
                      type="text"
                      value={settings.bkashMerchantNumber}
                      onChange={(e) =>
                        setSettings({ ...settings, bkashMerchantNumber: e.target.value })
                      }
                      className="w-full h-8 px-3 rounded-lg border border-slate-200 font-mono text-xs focus:outline-none"
                    />
                  </div>
                </div>

                {/* Nagad */}
                <div className="p-3.5 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-slate-900">Nagad Merchant</span>
                    <input
                      type="checkbox"
                      checked={settings.nagadEnabled}
                      onChange={(e) => setSettings({ ...settings, nagadEnabled: e.target.checked })}
                      className="size-4 accent-slate-900 cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">
                      Wallet Number
                    </label>
                    <input
                      type="text"
                      value={settings.nagadMerchantNumber}
                      onChange={(e) =>
                        setSettings({ ...settings, nagadMerchantNumber: e.target.value })
                      }
                      className="w-full h-8 px-3 rounded-lg border border-slate-200 font-mono text-xs focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Courier API */}
          {activeTab === "courier" && (
            <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  Courier Integrations
                </h3>
                <p className="text-xs text-slate-400">
                  Automate parcel booking with Steadfast and Pathao logistics.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl border border-slate-200 space-y-2">
                  <span className="font-semibold text-xs text-slate-900 block">Steadfast Courier API</span>
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">API Key</label>
                    <input
                      type="text"
                      value={settings.courierSteadfastKey}
                      onChange={(e) =>
                        setSettings({ ...settings, courierSteadfastKey: e.target.value })
                      }
                      className="w-full h-8 px-3 rounded-lg border border-slate-200 font-mono text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 space-y-2">
                  <span className="font-semibold text-xs text-slate-900 block">Pathao Courier API</span>
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">Client Secret</label>
                    <input
                      type="text"
                      value={settings.courierPathaoKey}
                      onChange={(e) =>
                        setSettings({ ...settings, courierPathaoKey: e.target.value })
                      }
                      className="w-full h-8 px-3 rounded-lg border border-slate-200 font-mono text-xs focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Store Profile */}
          {activeTab === "store" && (
            <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  Store Profile & Invoice
                </h3>
                <p className="text-xs text-slate-400">
                  Store contact information and invoice branding.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-600 mb-1">Store Name</label>
                  <input
                    type="text"
                    value={settings.storeName}
                    onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                    className="w-full h-8.5 px-3 rounded-lg border border-slate-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">Phone</label>
                  <input
                    type="text"
                    value={settings.storePhone}
                    onChange={(e) => setSettings({ ...settings, storePhone: e.target.value })}
                    className="w-full h-8.5 px-3 rounded-lg border border-slate-200 font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-600 mb-1">Email</label>
                  <input
                    type="email"
                    value={settings.storeEmail}
                    onChange={(e) => setSettings({ ...settings, storeEmail: e.target.value })}
                    className="w-full h-8.5 px-3 rounded-lg border border-slate-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">Address</label>
                  <input
                    type="text"
                    value={settings.storeAddress}
                    onChange={(e) => setSettings({ ...settings, storeAddress: e.target.value })}
                    className="w-full h-8.5 px-3 rounded-lg border border-slate-200 focus:outline-none"
                  />
                </div>
              </div>

              <div className="text-xs">
                <label className="block text-slate-600 mb-1">Invoice Footer Note</label>
                <textarea
                  rows={2}
                  value={settings.invoiceFooterNote}
                  onChange={(e) =>
                    setSettings({ ...settings, invoiceFooterNote: e.target.value })
                  }
                  className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none text-xs"
                />
              </div>
            </div>
          )}

          {/* Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-all shadow-xs cursor-pointer"
            >
              <Save className="size-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
