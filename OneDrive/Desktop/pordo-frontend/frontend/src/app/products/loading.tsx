import React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

export default function ProductsLoading() {
  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-5 max-w-full overflow-hidden animate-pulse">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="h-6 w-36 bg-slate-200 rounded-lg" />
            <div className="h-3 w-56 bg-slate-100 rounded-md" />
          </div>
          <div className="h-8 w-28 bg-slate-200 rounded-lg" />
        </div>

        {/* Search & Category Pills */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-3 shadow-2xs space-y-2.5">
          <div className="h-8 w-full bg-slate-100 rounded-lg" />
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-6 w-16 bg-slate-100 rounded-md shrink-0" />
            ))}
          </div>
        </div>

        {/* Product Table Skeleton */}
        <div className="rounded-xl border border-slate-200/80 bg-white shadow-2xs overflow-hidden">
          <div className="divide-y divide-slate-100 p-2 space-y-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-12 w-full bg-slate-50/70 rounded-lg flex items-center justify-between px-3 gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="size-8 rounded bg-slate-200 shrink-0" />
                  <div className="space-y-1">
                    <div className="h-3.5 w-32 bg-slate-200 rounded" />
                    <div className="h-2.5 w-16 bg-slate-100 rounded" />
                  </div>
                </div>
                <div className="h-3 w-16 bg-slate-200 rounded" />
                <div className="h-4 w-12 bg-slate-300 rounded" />
                <div className="h-3 w-10 bg-slate-200 rounded" />
                <div className="h-5 w-14 bg-slate-200 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
