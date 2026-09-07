"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { mockCustomers, Customer } from "@/lib/mock-data";
import {
  Search,
  Phone,
  MapPin,
  Plus,
  Copy,
  Check,
} from "lucide-react";

export default function CustomersPage() {
  const [customers] = useState<Customer[]>(mockCustomers);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);

  const handleCopyPhone = (phone: string) => {
    navigator.clipboard.writeText(phone);
    setCopiedPhone(phone);
    setTimeout(() => setCopiedPhone(null), 2000);
  };

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.district.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-5 max-w-full overflow-hidden">
        {/* Page Header */}
        <div className="flex items-center justify-between gap-2">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              Customer Directory
            </h1>
            <p className="text-[11px] sm:text-xs text-slate-500">
              Lookup saved addresses & orders
            </p>
          </div>

          <Link
            href="/orders/new"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold shadow-xs shrink-0"
          >
            <Plus className="size-3.5" />
            <span>New Order</span>
          </Link>
        </div>

        {/* Search */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-2.5 sm:p-3 shadow-xs">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search phone number, name, district..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-8.5 pl-9 pr-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none"
            />
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {filteredCustomers.map((customer) => (
            <div
              key={customer.id}
              className="bg-white border border-slate-200/80 rounded-xl p-3.5 sm:p-4.5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all space-y-3"
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{customer.name}</h4>
                    <span className="text-[10px] text-slate-400">{customer.email}</span>
                  </div>
                  <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {customer.status}
                  </span>
                </div>

                {/* Phone Pill */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                  <div className="flex items-center gap-1.5 font-mono text-slate-800 text-[11px]">
                    <Phone className="size-3 text-slate-400" />
                    <span>{customer.phone}</span>
                  </div>
                  <button
                    onClick={() => handleCopyPhone(customer.phone)}
                    className="p-0.5 text-slate-400 hover:text-slate-700 cursor-pointer"
                    title="Copy phone"
                  >
                    {copiedPhone === customer.phone ? (
                      <Check className="size-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="size-3.5" />
                    )}
                  </button>
                </div>

                {/* Address */}
                <div className="text-xs text-slate-600">
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 font-semibold mb-0.5">
                    <MapPin className="size-3" />
                    <span>{customer.district}</span>
                  </div>
                  <p className="line-clamp-2 leading-relaxed text-[11px]">{customer.address}</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Orders</span>
                    <p className="font-bold text-slate-900">{customer.totalOrders}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Spent</span>
                    <p className="font-bold text-slate-900">
                      ৳{customer.totalSpent.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <Link
                href={`/orders/new`}
                className="w-full py-1.5 rounded-lg bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-800 text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors"
              >
                <Plus className="size-3" />
                <span>Create Order</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
