import React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

export default function CategoriesLoading() {
  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-5 max-w-full overflow-hidden animate-pulse">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="h-6 w-48 bg-slate-200 rounded-lg" />
            <div className="h-3 w-56 bg-slate-100 rounded-md" />
          </div>
          <div className="h-8.5 w-32 bg-slate-200 rounded-lg self-start sm:self-auto" />
        </div>

        {/* Toolbar */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-3 shadow-2xs">
          <div className="h-8.5 w-full max-w-md bg-slate-100 rounded-lg" />
        </div>

        {/* Categories Card Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-11 rounded-lg bg-slate-200 shrink-0" />
                  <div className="space-y-1">
                    <div className="h-4 w-28 bg-slate-200 rounded" />
                    <div className="h-2.5 w-16 bg-slate-100 rounded" />
                  </div>
                </div>
                <div className="h-4 w-12 bg-slate-200 rounded-md" />
              </div>
              <div className="h-6 w-full bg-slate-50 rounded" />
              <div className="pt-2 border-t border-slate-100 flex justify-between">
                <div className="h-3 w-20 bg-slate-200 rounded" />
                <div className="h-3 w-16 bg-slate-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
