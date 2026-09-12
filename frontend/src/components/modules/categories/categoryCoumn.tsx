"use client";

import Image from "next/image";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Calendar, ImageOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { DataTableFeatures } from "@/shared/table/DataTable";

export interface ICategoryData {
  id: string;
  name: string;
  logo: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export const categoryColumns: ColumnDef<DataTableFeatures, ICategoryData>[] = [
  {
    accessorKey: "logo",
    header: "Logo",
    enableSorting: false,
    cell: ({ row }) => {
      const logo = row.original.logo;
      const name = row.original.name;

      return (
        <div className="relative size-10 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 flex items-center justify-center">
          {logo ? (
            <Image
              src={logo}
              alt={name || "Category logo"}
              fill
              sizes="40px"
              className="object-cover"
            />
          ) : (
            <ImageOff className="size-4 text-slate-400" />
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="-ml-3 h-8 cursor-pointer text-[11px] font-bold uppercase tracking-wider text-slate-600 hover:text-slate-900"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <span>Category Name</span>
        <ArrowUpDown className="ml-1 size-3.5 opacity-60" />
      </Button>
    ),
    cell: ({ row }) => (
      <div>
        <span className="block text-xs font-semibold capitalize text-slate-900">
          {row.original.name}
        </span>
        <span className="font-mono text-[10px] text-slate-400">
          ID: {row.original.id.slice(0, 8)}...
        </span>
      </div>
    ),
  },
  
  {
    accessorKey: "isDeleted",
    header: "Status",
    cell: ({ row }) => {
      const isDeleted = row.original.isDeleted;

      return isDeleted ? (
        <Badge
          variant="outline"
          className="gap-1.5 rounded-full border-rose-500/20 bg-rose-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-rose-600"
        >
          <span className="inline-block size-1.5 rounded-full bg-rose-500" />
          <span>Deleted</span>
        </Badge>
      ) : (
        <Badge
          variant="outline"
          className="gap-1.5 rounded-full border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600"
        >
          <span className="inline-block size-1.5 animate-pulse rounded-full bg-emerald-500" />
          <span>Active</span>
        </Badge>
      );
    },
  },
];