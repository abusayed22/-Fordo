import React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

export default function InventoryLoading() {
  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-5 max-w-full overflow-hidden animate-pulse">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="h-6 w-48 bg-slate-200 rounded-lg" />
            <div className="h-3 w-64 bg-slate-100 rounded-md" />
          </div>
          <div className="h-8 w-28 bg-slate-200 rounded-lg" />
        </div>

        {/* Low Stock Alert Banner Skeleton */}
        <div className="h-16 rounded-xl bg-amber-50 border border-amber-200/70 p-3.5 flex items-center justify-between" />

        {/* Filters */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-3 shadow-2xs space-y-2.5">
          <div className="h-8.5 w-full bg-slate-100 rounded-lg" />
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-7 w-20 bg-slate-100 rounded-md" />
            ))}
          </div>
        </div>

        {/* Stock Table Skeleton */}
        <div className="rounded-xl border border-slate-200/80 bg-white shadow-2xs overflow-hidden">
          <div className="divide-y divide-slate-100 p-2 space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 w-full bg-slate-50/70 rounded-lg flex items-center justify-between px-3 gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="size-8 rounded bg-slate-200 shrink-0" />
                  <div className="space-y-1">
                    <div className="h-3.5 w-32 bg-slate-200 rounded" />
                    <div className="h-2.5 w-16 bg-slate-100 rounded" />
                  </div>
                </div>
                <div className="h-4 w-12 bg-slate-300 rounded" />
                <div className="h-6 w-20 bg-slate-200 rounded-lg" />
                <div className="h-5 w-16 bg-slate-200 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
