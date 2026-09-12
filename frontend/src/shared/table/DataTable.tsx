"use client";

import React, { useMemo, useState } from "react";
import {
  ColumnDef,
  columnFilteringFeature,
  createCoreRowModel,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  flexRender,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSortingFeature,
  RowData,
  SortingState,
  tableFeatures,
  useTable,
} from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  Database,
  Eye,
  MoreHorizontal,
  Pencil,
  Search,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSearchParams } from "next/navigation";

const dataTableFeatures = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSortingFeature,
  coreRowModel: createCoreRowModel(),
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
});

export type DataTableFeatures = typeof dataTableFeatures;

export interface DataTableActions<TData extends RowData> {
  onView?: (data: TData) => void;
  onEdit?: (data: TData) => void;
  onDelete?: (data: TData) => void;
}

interface DataTableProps<TData extends RowData> {
  readonly data: TData[];
  readonly columns: ColumnDef<DataTableFeatures, TData>[];
  readonly isLoading?: boolean;
  readonly actions?: DataTableActions<TData>;
  readonly searchPlaceholder?: string;
  readonly emptyMessage?: string;
  readonly pageSize?: number;
}

export function DataTable<TData extends RowData>({
  data = [],
  columns,
  isLoading = false,
  actions,
  searchPlaceholder = "Search...",
  emptyMessage = "No records found.",
  pageSize = 10,
}: DataTableProps<TData>) {
  const searchParams = useSearchParams();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const tableColumns = useMemo<ColumnDef<DataTableFeatures, TData>[]>(() => {
    if (!actions) return columns;

    return [
      ...columns,
      {
        id: "actions",
        header: () => <div className="text-right"> </div>,
        enableSorting: false,
        cell: ({ row }) => {
          const rowData = row.original;
          return (
            <div className="flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger
                  type="button"
                  className="inline-flex size-8 cursor-pointer items-center justify-center rounded-md p-0 outline-none transition-colors hover:bg-slate-100"
                >
                  <span className="sr-only">Open Menu</span>
                  <MoreHorizontal className="size-4 text-slate-600" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-36">
                  {actions.onView && (
                    <DropdownMenuItem
                      className="cursor-pointer gap-2"
                      onClick={() => actions.onView?.(rowData)}
                    >
                      <Eye className="size-3.5 text-slate-400" />
                      View
                    </DropdownMenuItem>
                  )}
                  {actions.onEdit && (
                    <DropdownMenuItem
                      className="cursor-pointer gap-2"
                      onClick={() => actions.onEdit?.(rowData)}
                    >
                      <Pencil className="size-3.5 text-slate-400" />
                      Edit
                    </DropdownMenuItem>
                  )}
                  {actions.onDelete && (
                    <DropdownMenuItem
                      className="cursor-pointer gap-2 text-rose-600 focus:bg-rose-50 focus:text-rose-600"
                      onClick={() => actions.onDelete?.(rowData)}
                    >
                      <Trash2 className="size-3.5" />
                      Delete
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ];
  }, [columns, actions]);

  const table = useTable({
    key: "data-table",
    features: dataTableFeatures,
    data,
    columns: tableColumns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize,
      },
    },
  });

  const rows = table.getRowModel().rows;
  let tableBody: React.ReactNode;

  if (isLoading) {
    tableBody = (
      <TableRow>
        <TableCell colSpan={tableColumns.length} className="h-36 text-center text-xs text-[#60736f]">
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="size-5 animate-spin rounded-full border-2 border-[#e7b85c] border-t-transparent" />
            <span className="font-medium">Loading data...</span>
          </div>
        </TableCell>
      </TableRow>
    );
  } else if (rows.length > 0) {
    tableBody = rows.map((row) => (
      <TableRow key={row.id} className="group border-b border-[#edf1eb] transition-colors hover:bg-[#f3f8f1]">
        {row.getAllCells().map((cell) => (
          <TableCell
            key={cell.id}
            className={`px-4 py-3.5 text-slate-700 group-hover:text-slate-900 ${
              cell.column.id === "actions"
                ? "border-l-2 border-transparent group-hover:border-[#e7b85c]"
                : ""
            }`}
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
      </TableRow>
    ));
  } else {
    tableBody = (
      <TableRow>
        <TableCell colSpan={tableColumns.length} className="h-36 text-center text-xs text-[#60736f]">
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-xl bg-[#e8f0e7] text-[#55706c]">
              <Database className="size-4" />
            </div>
            <span className="font-medium">{emptyMessage}</span>
          </div>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <div className="w-full space-y-3">
      <div className="overflow-hidden rounded-[1.25rem] border border-[#174746] bg-[#123b3a] shadow-[0_18px_40px_-24px_rgba(18,59,58,0.75)]">
        <div className="flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-end sm:justify-between sm:px-5">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-[#e7b85c] text-[#123b3a] shadow-sm">
              <Database className="size-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#b9d5ce]">
                Data register
              </p>
              <p className="mt-0.5 text-sm font-semibold text-white">
                {data.length.toString().padStart(2, "0")} records in view
              </p>
            </div>
          </div>

          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#91b9b1]" />
          <input
            type="text"
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder={searchPlaceholder}
            className="h-10 w-full rounded-xl border border-white/15 bg-white/10 pl-9 pr-3 text-xs text-white outline-none transition-all placeholder:text-[#91b9b1] focus:border-[#e7b85c] focus:bg-white/15"
          />
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-white/10 px-4 py-2.5 text-[11px] text-[#b9d5ce] sm:px-5">
          <span>Showing {rows.length} of {data.length} entries</span>
          <span className="flex items-center gap-1.5 font-semibold text-[#e7b85c]">
            <span className="size-1.5 rounded-full bg-[#e7b85c]" />
            Live dataset
          </span>
        </div>
      </div>

      <div className="overflow-hidden rounded-[1.25rem] border border-slate-200 bg-[#fbfcf9] shadow-[0_18px_45px_-34px_rgba(15,23,42,0.8)]">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-[#123b3a]">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-b border-[#2d5a58]">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="h-11 px-4 text-[10px] font-bold uppercase tracking-[0.12em] text-[#d6e8df]">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
            </TableHeader>

            <TableBody className="divide-y divide-[#edf1eb]">{tableBody}</TableBody>
          </Table>
        </div>

        <div className="flex flex-col gap-3 border-t border-[#e5ebe3] bg-[#f4f7f1] px-4 py-3 text-xs text-[#60736f] sm:flex-row sm:items-center sm:justify-between">
          <span className="font-medium">
            Page <strong className="text-[#123b3a]">{table.state.pagination.pageIndex + 1}</strong> of {table.getPageCount() || 1}
          </span>

          <div className="flex items-center gap-1.5 self-end sm:self-auto">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="h-8 cursor-pointer gap-1 rounded-lg border-[#d6e1d7] bg-white text-[11px] font-semibold text-[#34534f] shadow-none disabled:cursor-not-allowed"
            >
              <ChevronLeft className="size-3.5" />
              Previous
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="h-8 cursor-pointer gap-1 rounded-lg border-[#d6e1d7] bg-white text-[11px] font-semibold text-[#34534f] shadow-none disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="size-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}