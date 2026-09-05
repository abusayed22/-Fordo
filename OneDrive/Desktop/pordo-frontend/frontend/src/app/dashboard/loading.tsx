import React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

export default function DashboardLoading() {
  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-5 max-w-full overflow-hidden animate-pulse">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1.5">
            <div className="h-6 w-48 bg-slate-200 rounded-lg" />
            <div className="h-3.5 w-64 bg-slate-100 rounded-md" />
          </div>
          <div className="h-8.5 w-32 bg-slate-200 rounded-lg self-start sm:self-auto" />
        </div>

        {/* 8 Pastel KPI Stat Cards Skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="h-20 sm:h-24 rounded-xl bg-slate-100/90 border border-slate-200/60 p-3 sm:p-3.5 flex flex-col justify-between"
            >
              <div className="flex justify-between items-center">
                <div className="h-3 w-16 bg-slate-200 rounded" />
                <div className="h-4 w-10 bg-slate-200 rounded-full" />
              </div>
              <div className="h-6 w-24 bg-slate-300 rounded-md" />
            </div>
          ))}
        </div>

        {/* Charts Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-8 rounded-xl bg-white border border-slate-200/80 p-4 sm:p-5 h-72 flex flex-col justify-between shadow-2xs">
            <div className="flex justify-between items-center">
              <div className="h-4 w-32 bg-slate-200 rounded" />
              <div className="h-6 w-24 bg-slate-100 rounded-lg" />
            </div>
            <div className="h-44 w-full bg-slate-50 rounded-lg" />
          </div>

          <div className="lg:col-span-4 rounded-xl bg-white border border-slate-200/80 p-4 sm:p-5 h-72 flex flex-col items-center justify-between shadow-2xs">
            <div className="h-4 w-28 bg-slate-200 rounded self-start" />
            <div className="size-36 rounded-full bg-slate-100 border-4 border-slate-200" />
            <div className="h-4 w-36 bg-slate-100 rounded" />
          </div>
        </div>

        {/* Recent Orders Table Skeleton */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs space-y-3">
          <div className="flex justify-between items-center">
            <div className="h-4 w-32 bg-slate-200 rounded" />
            <div className="h-4 w-16 bg-slate-100 rounded" />
          </div>
          <div className="space-y-2">
            {[1, 2, 3, 4].map((row) => (
              <div key={row} className="h-10 w-full bg-slate-50 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
