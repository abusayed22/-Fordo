import React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

export default function OrdersLoading() {
  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-5 max-w-full overflow-hidden animate-pulse">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1.5">
            <div className="h-6 w-40 bg-slate-200 rounded-lg" />
            <div className="h-3.5 w-60 bg-slate-100 rounded-md" />
          </div>
          <div className="h-8.5 w-32 bg-slate-200 rounded-lg self-start sm:self-auto" />
        </div>

        {/* Toolbar & Filter Tabs */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-3 shadow-2xs space-y-2.5">
          <div className="h-8.5 w-full max-w-md bg-slate-100 rounded-lg" />
          <div className="flex gap-2 overflow-x-auto pb-1">
            {[1, 2, 3, 4, 5, 6].map((tab) => (
              <div key={tab} className="h-7 w-20 bg-slate-100 rounded-md shrink-0" />
            ))}
          </div>
        </div>

        {/* Orders Table Skeleton */}
        <div className="rounded-xl border border-slate-200/80 bg-white shadow-2xs overflow-hidden">
          <div className="p-3.5 bg-slate-50 border-b border-slate-100 flex justify-between">
            <div className="h-4 w-24 bg-slate-200 rounded" />
            <div className="h-4 w-16 bg-slate-200 rounded" />
          </div>
          <div className="divide-y divide-slate-100 p-2 space-y-2">
            {[1, 2, 3, 4, 5, 6].map((row) => (
              <div key={row} className="h-12 w-full bg-slate-50/70 rounded-lg flex items-center justify-between px-3">
                <div className="h-4 w-20 bg-slate-200 rounded" />
                <div className="h-4 w-32 bg-slate-200 rounded" />
                <div className="h-4 w-24 bg-slate-200 rounded" />
                <div className="h-6 w-16 bg-slate-200 rounded-md" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
