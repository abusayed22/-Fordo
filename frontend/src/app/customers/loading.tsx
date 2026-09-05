import React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

export default function CustomersLoading() {
  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-5 max-w-full overflow-hidden animate-pulse">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="h-6 w-44 bg-slate-200 rounded-lg" />
            <div className="h-3 w-56 bg-slate-100 rounded-md" />
          </div>
          <div className="h-8.5 w-32 bg-slate-200 rounded-lg self-start sm:self-auto" />
        </div>

        {/* 3 Metric Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 rounded-xl bg-white border border-slate-200/80 p-3.5 flex justify-between items-center shadow-2xs">
              <div className="space-y-1.5">
                <div className="h-3 w-24 bg-slate-200 rounded" />
                <div className="h-5 w-16 bg-slate-300 rounded" />
              </div>
              <div className="size-10 rounded-xl bg-slate-100" />
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-3 shadow-2xs">
          <div className="h-8.5 w-full max-w-md bg-slate-100 rounded-lg" />
        </div>

        {/* Customer Table Skeleton */}
        <div className="rounded-xl border border-slate-200/80 bg-white shadow-2xs overflow-hidden">
          <div className="divide-y divide-slate-100 p-2 space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 w-full bg-slate-50/70 rounded-lg flex items-center justify-between px-3 gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="size-8 rounded-full bg-slate-200 shrink-0" />
                  <div className="space-y-1">
                    <div className="h-3.5 w-28 bg-slate-200 rounded" />
                    <div className="h-2.5 w-20 bg-slate-100 rounded" />
                  </div>
                </div>
                <div className="h-3 w-24 bg-slate-200 rounded" />
                <div className="h-3 w-20 bg-slate-200 rounded" />
                <div className="h-5 w-16 bg-slate-200 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
