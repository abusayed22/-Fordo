import React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

export default function DiscountsLoading() {
  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-5 max-w-full overflow-hidden animate-pulse">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="h-6 w-48 bg-slate-200 rounded-lg" />
            <div className="h-3 w-64 bg-slate-100 rounded-md" />
          </div>
          <div className="h-8.5 w-32 bg-slate-200 rounded-lg" />
        </div>

        {/* Coupons Card Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs space-y-3"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="h-5 w-24 bg-slate-200 rounded" />
                  <div className="h-3 w-36 bg-slate-100 rounded" />
                </div>
                <div className="h-5 w-12 bg-slate-200 rounded-md" />
              </div>
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
