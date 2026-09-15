"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Search,
  Plus,
  ShoppingBag,
  Printer,
  ShieldAlert,
} from "lucide-react";
import { DataTable } from "@/shared/table/DataTable";
import {
  getOrdersData,
  updateOrderStatusAction,
} from "@/services/order.service";
import type { ICreateOrderResponseData, OrderStatus } from "@/types/order.types";
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { orderColumns } from "./OrderColumn";

interface OrderListProps {
  userRole?: string;
}

export default function OrderList({ userRole = "ADMIN" }: OrderListProps) {
  const queryClient = useQueryClient();

  const normalizedRole = userRole?.toUpperCase() || "USER";
  const hasManagerAccess = normalizedRole === "ADMIN" || normalizedRole === "MANAGER";

  const [activeTab, setActiveTab] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<ICreateOrderResponseData | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState<string | null>(null);
  const [cancelError, setCancelError] = useState("");

  const { data: orderResponse, isLoading } = useQuery({
    queryKey: ["admin-orders", { status: activeTab, search: searchQuery }],
    queryFn: () =>
      getOrdersData({
        status: activeTab === "All" ? undefined : activeTab,
        search: searchQuery.trim() || undefined,
        limit: 100,
      }),
    refetchOnWindowFocus: "always",
  });

  const { mutateAsync: updateStatus, isPending: isUpdating } = useMutation({
    mutationFn: updateOrderStatusAction,
  });

  const ordersList: ICreateOrderResponseData[] = useMemo(() => {
    if (Array.isArray(orderResponse?.data)) return orderResponse.data;
    if (Array.isArray((orderResponse as any)?.orders)) return (orderResponse as any).orders;
    return [];
  }, [orderResponse]);

  const filterTabs = [
    { label: "All" },
    { label: "PENDING" },
    { label: "PROCESSING" },
    { label: "DELIVERED" },
    { label: "CANCELLED" },
  ];

  const handleOpenDetails = (order: ICreateOrderResponseData) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };

  const handleStatusChange = async (orderId: string, nextStatus: OrderStatus) => {
    if (!hasManagerAccess) return;

    await updateStatus({ orderId, status: nextStatus });
    await queryClient.invalidateQueries({ queryKey: ["admin-orders"] });

    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev) => (prev ? { ...prev, status: nextStatus } : null));
    }
  };

  const confirmCancelOrder = async () => {
    if (!orderToCancel || !hasManagerAccess) return;
    setCancelError("");

    try {
      await updateStatus({ orderId: orderToCancel, status: "CANCELLED" });
      await queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      setOrderToCancel(null);
    } catch (err: any) {
      setCancelError(err?.message || "Unable to cancel the order.");
    }
  };

  return (
    <div>
      {/* 🖨️ প্রিন্ট অপটিমাইজেশন CSS */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-invoice, #printable-invoice * {
            visibility: visible;
          }
          #printable-invoice {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 24px;
            background: white !important;
            color: black !important;
          }
        }
      `}</style>

      <div className="space-y-4 sm:space-y-5 max-w-full overflow-hidden print:hidden">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              Orders Management
            </h1>
            <p className="text-[11px] sm:text-xs text-slate-500">
              {hasManagerAccess
                ? `Full access granted (${normalizedRole}): Status, Edit & Cancellation available.`
                : "Staff / Viewer mode: Read-only order tracking."}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {hasManagerAccess ? (
              <Link
                href="/manual-order-entry/create"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 shadow-xs transition-all cursor-pointer"
              >
                <Plus className="size-3.5" />
                <span>Create Order</span>
              </Link>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600">
                <ShieldAlert className="size-3.5 text-slate-400" />
                Read-only
              </span>
            )}
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-xs space-y-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
            {filterTabs.map((tab) => (
              <button
                key={tab.label}
                type="button"
                onClick={() => setActiveTab(tab.label)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-all cursor-pointer ${
                  activeTab === tab.label
                    ? "bg-slate-900 text-white font-semibold"
                    : "bg-slate-100/70 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by order number, customer name, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-slate-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Shared DataTable Component */}
        <DataTable
          columns={orderColumns}
          data={ordersList}
          isLoading={isLoading}
          actions={{
            onEdit: (order) => handleOpenDetails(order),
            onDelete: hasManagerAccess ? (order) => setOrderToCancel(order.id) : undefined,
          }}
        />

        {/* Sheet Drawer */}
        <Sheet open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-md">
            <SheetHeader className="border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ShoppingBag className="size-4 text-slate-700" />
                <SheetTitle>Order #{selectedOrder?.orderNumber}</SheetTitle>
              </div>
              <SheetDescription>
                Placed on:{" "}
                {selectedOrder?.createdAt
                  ? new Date(selectedOrder.createdAt).toLocaleString()
                  : "N/A"}
              </SheetDescription>
            </SheetHeader>

            {selectedOrder && (
              <div className="space-y-4 px-4 py-3 text-xs">
                {/* Customer Details */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                    Customer Info
                  </span>
                  <p className="font-semibold text-slate-900">
                    {selectedOrder.customerName || "Walk-in Customer"}
                  </p>
                  <p className="font-mono text-slate-500">{selectedOrder.customerPhone || "N/A"}</p>
                  <p className="text-slate-600 pt-1 border-t border-slate-200/60">
                    {selectedOrder.shippingAddress || "Counter Order"}
                  </p>
                </div>

                {/* Status Updater */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold text-slate-700">Order Status</label>
                    {!hasManagerAccess && (
                      <span className="text-[10px] text-slate-400">Read only</span>
                    )}
                  </div>
                  <select
                    disabled={!hasManagerAccess || isUpdating}
                    value={selectedOrder.status}
                    onChange={(e) =>
                      handleStatusChange(selectedOrder.id, e.target.value as OrderStatus)
                    }
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs outline-none transition focus:border-emerald-500 focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="PROCESSING">Processing</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>

                {/* Items List */}
                <div>
                  <span className="mb-2 block font-semibold text-slate-700">Order Items</span>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto">
                    {selectedOrder.orderItems?.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center p-2 rounded-lg bg-slate-50 border border-slate-100"
                      >
                        <div>
                          <p className="font-semibold text-slate-900">
                            {item.product?.title || "Product"}
                          </p>
                          <span className="text-[10px] text-slate-400">৳{item.unitPrice} each</span>
                        </div>
                        <span className="font-bold text-slate-900">
                          ৳{item.unitPrice} × {item.quantity} = ৳{item.totalPrice}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bill Summary */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                  <div className="flex justify-between text-slate-500">
                    <span>Subtotal</span>
                    <span className="font-semibold text-slate-900">৳{selectedOrder.subTotal}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Delivery Fee</span>
                    <span className="font-semibold text-slate-900">৳{selectedOrder.deliveryFee}</span>
                  </div>
                  {selectedOrder.discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-medium">
                      <span>Discount</span>
                      <span>- ৳{selectedOrder.discountAmount}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-1 border-t border-slate-200 font-bold text-sm">
                    <span>Total Payable</span>
                    <span className="text-slate-900">৳{selectedOrder.totalAmount}</span>
                  </div>
                </div>

                {/* Print Action */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="w-full py-2.5 rounded-lg bg-slate-900 text-white font-semibold flex items-center justify-center gap-1.5 hover:bg-slate-800 transition-all cursor-pointer"
                  >
                    <Printer className="size-3.5" /> Print Invoice
                  </button>
                </div>
              </div>
            )}
          </SheetContent>
        </Sheet>

        {/* Cancel Dialog */}
        {hasManagerAccess && (
          <AlertDialog
            open={orderToCancel !== null}
            onOpenChange={(open) => {
              if (!open) setOrderToCancel(null);
            }}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Cancel this order?</AlertDialogTitle>
                <AlertDialogDescription>
                  {cancelError ||
                    "Are you sure you want to mark this order as CANCELLED? Reserved inventory will need to be re-adjusted."}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Keep Order</AlertDialogCancel>
                <AlertDialogAction
                  type="button"
                  onClick={confirmCancelOrder}
                  disabled={isUpdating}
                  className="bg-rose-600 text-white hover:bg-rose-700"
                >
                  {isUpdating ? "Cancelling..." : "Cancel Order"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      {/* 📄 ডেডিকেটেড প্রিন্ট-অনলি ইনভয়েস ভিউ (স্ক্রিনে লুকানো থাকবে) */}
      {selectedOrder && (
        <div id="printable-invoice" className="hidden print:block font-sans text-slate-900">
          {/* হেডার ও ইনভয়েস মেটা */}
          <div className="flex justify-between items-start border-b-2 border-slate-900 pb-5">
            <div>
              <h1 className="text-2xl font-black uppercase tracking-tight text-slate-950">
                POS INVOICE
              </h1>
              <p className="text-xs text-slate-500 mt-1">Retail & Counter Sales</p>
              <p className="text-xs text-slate-600">Dhaka, Bangladesh</p>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold font-mono">#{selectedOrder.orderNumber}</div>
              <p className="text-xs text-slate-500 mt-0.5">
                Date: {new Date(selectedOrder.createdAt).toLocaleDateString()}
              </p>
              <p className="text-xs text-slate-500">
                Time: {new Date(selectedOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
              <div className="mt-1 inline-block border border-slate-300 px-2 py-0.5 text-[10px] font-bold uppercase rounded">
                Payment: {selectedOrder.paymentMethod || "COD"}
              </div>
            </div>
          </div>

          {/* কাস্টমার ও ডেলিভারি তথ্য */}
          <div className="my-6 grid grid-cols-2 gap-4 border border-slate-200 rounded-lg p-4 bg-slate-50/50">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Billed To
              </span>
              <p className="text-sm font-bold text-slate-900">
                {selectedOrder.customerName || "Walk-in Customer"}
              </p>
              <p className="text-xs font-mono text-slate-600 mt-0.5">
                Phone: {selectedOrder.customerPhone || "N/A"}
              </p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Shipping Address
              </span>
              <p className="text-xs text-slate-700 leading-relaxed">
                {selectedOrder.shippingAddress || "Counter Pickup / Inside Dhaka"}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Order Status: <span className="font-semibold text-slate-800">{selectedOrder.status}</span>
              </p>
            </div>
          </div>

          {/* আইটেম টেবিল */}
          <div className="my-6">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-900 text-slate-700 uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-1 font-bold">SL</th>
                  <th className="py-2.5 px-2 font-bold">Product Description</th>
                  <th className="py-2.5 px-2 text-center font-bold">Qty</th>
                  <th className="py-2.5 px-2 text-right font-bold">Unit Price</th>
                  <th className="py-2.5 px-1 text-right font-bold">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {selectedOrder.orderItems?.map((item, idx) => (
                  <tr key={item.id}>
                    <td className="py-2.5 px-1 text-slate-500">{idx + 1}</td>
                    <td className="py-2.5 px-2">
                      <p className="font-semibold text-slate-900">{item.product?.title || "Item"}</p>
                    </td>
                    <td className="py-2.5 px-2 text-center font-semibold text-slate-800">
                      {item.quantity}
                    </td>
                    <td className="py-2.5 px-2 text-right font-mono text-slate-700">
                      ৳{item.unitPrice.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-1 text-right font-bold font-mono text-slate-900">
                      ৳{item.totalPrice.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* টোটাল সামারি ও টার্মস */}
          <div className="flex justify-between items-start pt-3 border-t-2 border-slate-900">
            <div className="w-1/2 pr-6">
              <h4 className="text-[11px] font-bold uppercase text-slate-800 tracking-wider mb-1">
                Terms & Conditions
              </h4>
              <p className="text-[10px] text-slate-500 leading-relaxed">
                Goods once sold can only be exchanged within 7 days with invoice slip. 
                Thank you for your business!
              </p>
            </div>

            <div className="w-1/2 max-w-[260px] space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-semibold font-mono">৳{selectedOrder.subTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery Fee:</span>
                <span className="font-semibold font-mono">৳{selectedOrder.deliveryFee.toLocaleString()}</span>
              </div>
              {selectedOrder.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Discount:</span>
                  <span className="font-semibold font-mono">-৳{selectedOrder.discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold border-t-2 border-slate-900 pt-2 text-slate-950">
                <span>Total Amount:</span>
                <span className="font-mono">৳{selectedOrder.totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* সিগনেচার এরিয়া */}
          <div className="mt-16 pt-8 flex justify-between items-end text-xs text-slate-500">
            <div className="border-t border-slate-300 w-40 text-center pt-1">
              Customer Signature
            </div>
            <div className="border-t border-slate-300 w-40 text-center pt-1">
              Authorized Signature
            </div>
          </div>
        </div>
      )}
    </div>
  );
}