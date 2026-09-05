"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { mockOrders, Order } from "@/lib/mock-data";
import {
  Search,
  Plus,
  Eye,
  Download,
  Phone,
  Calendar,
  X,
  Printer,
} from "lucide-react";

export default function OrdersListPage() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [activeTab, setActiveTab] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filterTabs = [
    { label: "All", count: orders.length },
    { label: "Pending", count: orders.filter((o) => o.status === "Pending").length },
    { label: "Processing", count: orders.filter((o) => o.status === "Processing").length },
    { label: "Delivered", count: orders.filter((o) => o.status === "Delivered").length },
    { label: "Cancelled", count: orders.filter((o) => o.status === "Cancelled").length },
    { label: "Returned", count: orders.filter((o) => o.status === "Returned").length },
  ];

  const handleStatusChange = (orderId: string, newStatus: Order["status"]) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesTab = activeTab === "All" || order.status === activeTab;
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerPhone.includes(searchQuery);
    return matchesTab && matchesSearch;
  });

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
      <div className="space-y-5">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Orders Management
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              All customer orders, fulfillment tracking and live status updates
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => alert("Orders exported as CSV.")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-all shadow-2xs cursor-pointer"
            >
              <Download className="size-3.5" /> Export
            </button>
            <Link
              href="/orders/new"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 shadow-xs transition-all"
            >
              <Plus className="size-3.5" />
              <span>New Order</span>
            </Link>
          </div>
        </div>

        {/* Minimal Toolbar */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-xs space-y-3">
          {/* Tab Navigation */}
          <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar-gray pb-0.5">
            {filterTabs.map((tab) => (
              <button
                key={tab.label}
                onClick={() => setActiveTab(tab.label)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === tab.label
                    ? "bg-slate-900 text-white font-semibold"
                    : "bg-slate-100/70 text-slate-600 hover:bg-slate-100"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    activeTab === tab.label
                      ? "bg-white/20 text-white"
                      : "bg-white text-slate-600"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Order #, customer name, phone number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-8.5 pl-9 pr-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-slate-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Minimal Orders Table */}
        <div className="bg-white border border-slate-200/80 rounded-xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar-gray">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 text-slate-500 font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4 sm:px-5">Order ID</th>
                  <th className="py-3 px-3">Customer</th>
                  <th className="py-3 px-3">Area</th>
                  <th className="py-3 px-3">Items</th>
                  <th className="py-3 px-3">Total</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-4 sm:px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-slate-400 font-medium">
                      No matching orders found.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4 sm:px-5">
                        <span className="font-bold text-slate-900 font-mono block">
                          {order.orderNumber}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {order.orderDate}
                        </span>
                      </td>

                      <td className="py-3.5 px-3">
                        <div className="font-semibold text-slate-900">{order.customerName}</div>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {order.customerPhone}
                        </span>
                      </td>

                      <td className="py-3.5 px-3">
                        <span className="text-[11px] font-medium text-slate-600">
                          {order.deliveryZone}
                        </span>
                      </td>

                      <td className="py-3.5 px-3 text-slate-600">
                        {order.items.length} item(s)
                      </td>

                      <td className="py-3.5 px-3">
                        <div className="font-bold text-slate-900">
                          ৳{order.totalAmount.toLocaleString()}
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {order.paymentMethod}
                        </span>
                      </td>

                      {/* Status Selector */}
                      <td className="py-3.5 px-3">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(order.id, e.target.value as Order["status"])
                          }
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border focus:outline-none cursor-pointer ${getStatusBadge(
                            order.status
                          )}`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                          <option value="Returned">Returned</option>
                        </select>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 sm:px-5 text-right">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-50 hover:bg-slate-100 text-slate-700 text-[11px] font-semibold border border-slate-200/60 transition-colors cursor-pointer"
                        >
                          <Eye className="size-3" /> Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Minimal Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
            <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-xl space-y-4 animate-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Order {selectedOrder.orderNumber}
                  </h3>
                  <span className="text-[11px] text-slate-400">{selectedOrder.orderDate}</span>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="size-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
                >
                  <X className="size-3.5" />
                </button>
              </div>

              {/* Customer summary */}
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs space-y-1">
                <p className="font-semibold text-slate-900">{selectedOrder.customerName}</p>
                <p className="font-mono text-slate-500">{selectedOrder.customerPhone}</p>
                <p className="text-slate-600 pt-1 border-t border-slate-200/60">
                  {selectedOrder.customerAddress} ({selectedOrder.deliveryZone})
                </p>
              </div>

              {/* Items */}
              <div className="space-y-1.5 max-h-40 overflow-y-auto custom-scrollbar-gray text-xs">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center p-2 rounded-md bg-slate-50/70">
                    <div>
                      <span className="font-semibold text-slate-900">{item.name}</span>
                      <span className="block text-[10px] text-slate-400">SKU: {item.sku}</span>
                    </div>
                    <span className="font-bold text-slate-900">
                      ৳{item.price} × {item.quantity} = ৳{item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              {/* Invoice Breakdown */}
              <div className="p-3 rounded-lg bg-slate-50 text-xs space-y-1">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">৳{selectedOrder.subtotal}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Delivery Fee</span>
                  <span className="font-semibold text-slate-900">৳{selectedOrder.deliveryFee}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount</span>
                    <span>- ৳{selectedOrder.discount}</span>
                  </div>
                )}
                <div className="flex justify-between pt-1 border-t border-slate-200 font-bold text-sm">
                  <span>Total Amount</span>
                  <span className="text-slate-900">৳{selectedOrder.totalAmount}</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Printer className="size-3.5" /> Print Invoice
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
