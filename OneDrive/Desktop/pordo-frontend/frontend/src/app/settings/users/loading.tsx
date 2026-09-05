import React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

export default function UsersLoading() {
  return (
    <DashboardLayout>
      <div className="space-y-5 max-w-full overflow-hidden animate-pulse">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="h-6 w-56 bg-slate-200 rounded-lg" />
            <div className="h-3 w-72 bg-slate-100 rounded-md" />
          </div>
          <div className="h-8.5 w-36 bg-slate-200 rounded-lg self-start sm:self-auto" />
        </div>

        {/* Officers Table Skeleton */}
        <div className="rounded-xl border border-slate-200/80 bg-white shadow-2xs overflow-hidden">
          <div className="divide-y divide-slate-100 p-2 space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 w-full bg-slate-50/70 rounded-lg flex items-center justify-between px-4 gap-3">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-full bg-slate-200 shrink-0" />
                  <div className="space-y-1">
                    <div className="h-3.5 w-28 bg-slate-200 rounded" />
                    <div className="h-2.5 w-20 bg-slate-100 rounded" />
                  </div>
                </div>
                <div className="h-3 w-32 bg-slate-200 rounded" />
                <div className="h-5 w-16 bg-slate-200 rounded" />
                <div className="h-7 w-24 bg-slate-200 rounded-lg" />
              </div>
            ))}
          </div>
        </div>

        {/* Permission Matrix Skeleton */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-2xs space-y-3">
          <div className="h-4 w-44 bg-slate-200 rounded" />
          <div className="h-40 w-full bg-slate-50 rounded-xl" />
        </div>
      </div>
    </DashboardLayout>
  );
}
