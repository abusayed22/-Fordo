"use client";

import Image from "next/image";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Calendar, ImageOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { DataTableFeatures } from "@/shared/table/DataTable";

export interface IBrandData {
    id: string;
    name: string;
    logo: string;
    createdAt: string;
    updatedAt: string;
}

export const brandColumns: ColumnDef<DataTableFeatures, IBrandData>[] = [
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
                            alt={name || "Brand logo"}
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
                <span>Brand Name</span>
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


];

