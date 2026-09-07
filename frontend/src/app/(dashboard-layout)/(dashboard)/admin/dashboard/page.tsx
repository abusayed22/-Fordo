"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRole } from "@/context/role-context";
import { AccessDenied } from "@/components/common/access-denied";
import { RevenueChart } from "@/components/modules/dashboard/revenue-chart";
import { OrderStatusDonut } from "@/components/modules/dashboard/order-status-donut";
import { FulfillmentStatus } from "@/components/modules/dashboard/fulfillment-status";
import { TopRegions } from "@/components/modules/dashboard/top-regions";
import { mockOrders, mockProducts, Order } from "@/lib/mock-data";
import {
  Plus,
  Eye,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";
import { StatCard } from "@/components/modules/dashboard/stat-card";

export default function DashboardPage() {
  const { hasManagerAccess } = useRole();
  const [orders] = useState<Order[]>(mockOrders);

  if (!hasManagerAccess) {
    return (
      <div>
        <AccessDenied pageTitle="Dashboard / Analytics Overview" allowedRoles={["ADMIN", "MANAGER"]} />
      </div>
    );
  }

  // 8 Pastel Metric Cards
  const statCards = [
    { title: "Total Sales", value: "৳1,28,450", change: "+12.4%", isPositive: true, bgColor: "rgba(160,226,224,0.60)" },
    { title: "Total Orders", value: "1,240", change: "+8.2%", isPositive: true, bgColor: "rgba(255,235,105,0.60)" },
    { title: "Customers", value: "5,420", change: "+15.3%", isPositive: true, bgColor: "rgba(255,192,145,0.60)" },
    { title: "Delays / Holds", value: "12", change: "-2.1%", isPositive: true, bgColor: "rgba(255,214,239,0.60)" },
    { title: "Refunds", value: "৳8,450", change: "-1.5%", isPositive: true, bgColor: "rgba(146,189,245,0.60)" },
    { title: "Stock Catalog", value: "380 Items", change: "+4.1%", isPositive: true, bgColor: "rgba(250,184,81,0.60)" },
    { title: "Carts Drop", value: "64", change: "-5.0%", isPositive: true, bgColor: "rgba(158,232,114,0.60)" },
    { title: "Net Profit", value: "৳54,200", change: "+18.6%", isPositive: true, bgColor: "rgba(116,202,255,0.60)" },
  ];

  const getStatusBadge = (status: Order["status"]) => {
    switch (status) {
      case "Pending":
        return "bg-amber-50 text-amber-700 border-amber-200/80";
      case "Processing":
        return "bg-blue-50 text-blue-700 border-blue-200/80";
      case "Delivered":
        return "bg-emerald-50 text-emerald-700 border-emerald-200/80";
      case "Cancelled":
        return "bg-rose-50 text-rose-700 border-rose-200/80";
      case "Returned":
        return "bg-purple-50 text-purple-700 border-purple-200/80";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <div>
      <div className="space-y-4 sm:space-y-6 max-w-full overflow-hidden">
        {/* Page Top Header */}
        <div className="flex items-center justify-between gap-2">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              Dashboard
            </h1>
            <p className="text-[11px] sm:text-xs text-slate-500">
              Overview & live analytics
            </p>
          </div>

          <Link
            href="/orders/new"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors shrink-0"
          >
            <Plus className="size-3.5" />
            <span>New Order</span>
          </Link>
        </div>

        {/* 8 Pastel Metric Cards in Responsive 2-Col Mobile Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
          {statCards.map((stat, idx) => (
            <StatCard key={idx} {...stat} />
          ))}
        </div>

        {/* Charts: Revenue & Order Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
          <div className="lg:col-span-2">
            <RevenueChart />
          </div>
          <div className="lg:col-span-1">
            <OrderStatusDonut />
          </div>
        </div>

        {/* Secondary Widgets: Fulfillment & Top Regions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
          <FulfillmentStatus />
          <TopRegions />
        </div>

        {/* Recent Orders Table */}
        <div className="bg-white border border-slate-200/80 rounded-xl shadow-xs overflow-hidden max-w-full">
          <div className="p-3.5 sm:p-5 flex items-center justify-between border-b border-slate-100">
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wide">
                Recent Orders
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
                Latest orders from manual entry & store
              </p>
            </div>
            <Link
              href="/orders"
              className="inline-flex items-center gap-0.5 text-xs font-semibold text-slate-700 hover:text-slate-900"
            >
              All <ChevronRight className="size-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto custom-scrollbar-gray w-full">
            <table className="w-full text-left text-xs min-w-[540px]">
              <thead className="bg-slate-50/70 text-slate-500 font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-2.5 px-3 sm:px-4">Order ID</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Area</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 sm:px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-3 sm:px-4 font-bold text-slate-900 font-mono">
                      {order.orderNumber}
                      <span className="block text-[10px] font-normal text-slate-400">
                        {order.orderDate}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-900">{order.customerName}</div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {order.customerPhone}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-[10px] font-medium text-slate-600">
                        {order.deliveryZone}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-900">
                      ৳{order.totalAmount.toLocaleString()}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-semibold border ${getStatusBadge(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 sm:px-4 text-right">
                      <Link
                        href="/orders"
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-semibold transition-colors"
                      >
                        <Eye className="size-3" /> View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alert Table */}
        <div className="bg-white border border-slate-200/80 rounded-xl shadow-xs overflow-hidden max-w-full">
          <div className="p-3.5 sm:p-5 flex items-center justify-between border-b border-slate-100">
            <div className="flex items-center gap-2">
              <AlertTriangle className="size-4 text-amber-500" />
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wide">
                  Stock Alerts
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-400">
                  Products running low on inventory
                </p>
              </div>
            </div>
            <Link
              href="/inventory"
              className="inline-flex items-center gap-0.5 text-xs font-semibold text-slate-700 hover:text-slate-900"
            >
              Inventory <ChevronRight className="size-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto custom-scrollbar-gray w-full">
            <table className="w-full text-left text-xs min-w-[500px]">
              <thead className="bg-slate-50/70 text-slate-500 font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-2.5 px-3 sm:px-4">Product</th>
                  <th className="py-2.5 px-3">SKU</th>
                  <th className="py-2.5 px-3">Price</th>
                  <th className="py-2.5 px-3">Stock</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 sm:px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {mockProducts
                  .filter((p) => p.status === "Low Stock" || p.status === "Out of Stock")
                  .map((product) => (
                    <tr key={product.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-3 sm:px-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="size-8 rounded object-cover border border-slate-200"
                          />
                          <span className="font-semibold text-slate-900">{product.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-500">{product.sku}</td>
                      <td className="py-3 px-3 font-semibold text-slate-900">
                        ৳{product.salePrice.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 font-bold text-rose-600">
                        {product.stock} units
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`text-[10px] font-semibold px-1.5 py-0.2 rounded border ${
                            product.status === "Out of Stock"
                              ? "bg-rose-50 text-rose-700 border-rose-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}
                        >
                          {product.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 sm:px-4 text-right">
                        <Link
                          href="/inventory"
                          className="inline-flex items-center px-2 py-0.5 rounded bg-slate-900 text-white text-[10px] font-semibold"
                        >
                          Restock
                        </Link>
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
