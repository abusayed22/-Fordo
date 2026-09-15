// components/orders/orderColumns.tsx
import { ColumnDef } from "@tanstack/react-table";
import { ICreateOrderResponseData, OrderStatus } from "@/types/order.types";
import type { DataTableFeatures } from "@/shared/table/DataTable";

const getStatusBadgeVariant = (status: OrderStatus) => {
  switch (status) {
    case "PENDING":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "PROCESSING":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "DELIVERED":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "CANCELLED":
      return "bg-rose-50 text-rose-700 border-rose-200";
    default:
      return "bg-slate-50 text-slate-700 border-slate-200";
  }
};

export const orderColumns: ColumnDef<DataTableFeatures, ICreateOrderResponseData>[] = [
  {
    accessorKey: "orderNumber",
    header: "Order ID",
    cell: ({ row }) => {
      const order = row.original;
      return (
        <div>
          <span className="font-bold text-slate-900 font-mono block">
            {order.orderNumber}
          </span>
          <span className="text-[10px] text-slate-400">
            {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "customerName",
    header: "Customer",
    cell: ({ row }) => {
      const order = row.original;
      return (
        <div>
          <div className="font-semibold text-slate-900">
            {order.customerName || "Walk-in Customer"}
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            {order.customerPhone || "N/A"}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "shippingAddress",
    header: "Delivery Address",
    cell: ({ row }) => (
      <span className="text-[11px] font-medium text-slate-600 truncate max-w-[150px] block">
        {row.original.shippingAddress || "Counter POS"}
      </span>
    ),
  },
  {
    id: "items",
    header: "Items",
    cell: ({ row }) => (
      <span className="text-slate-600 font-medium">
        {row.original.orderItems?.length || 0} item(s)
      </span>
    ),
  },
  {
    accessorKey: "totalAmount",
    header: "Total",
    cell: ({ row }) => {
      const order = row.original;
      return (
        <div>
          <div className="font-bold text-slate-900">
            ৳{(order.totalAmount || 0).toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-400 uppercase font-medium">
            {order.paymentMethod || "COD"}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <span
          className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${getStatusBadgeVariant(
            status
          )}`}
        >
          {status}
        </span>
      );
    },
  },
];