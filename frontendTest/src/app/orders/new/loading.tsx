import React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

export default function NewOrderLoading() {
  return (
    <DashboardLayout>
      <div className="space-y-4 max-w-full overflow-hidden animate-pulse">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="h-6 w-48 bg-slate-200 rounded-lg" />
            <div className="h-3 w-64 bg-slate-100 rounded-md" />
          </div>
          <div className="h-6 w-20 bg-slate-200 rounded-md" />
        </div>

        {/* 2-Column POS Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left: Customer Lookup & Product Grid (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Customer Search Box */}
            <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-2xs space-y-2">
              <div className="h-3 w-32 bg-slate-200 rounded" />
              <div className="h-9 w-full bg-slate-100 rounded-lg" />
            </div>

            {/* Product Grid */}
            <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-2xs space-y-3">
              <div className="flex justify-between">
                <div className="h-8 w-48 bg-slate-100 rounded-lg" />
                <div className="h-8 w-24 bg-slate-100 rounded-lg" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-36 rounded-xl bg-slate-50 border border-slate-200/60 p-2 space-y-2">
                    <div className="h-16 w-full bg-slate-200 rounded-lg" />
                    <div className="h-3 w-20 bg-slate-200 rounded" />
                    <div className="h-4 w-12 bg-slate-300 rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: POS Order Summary & Cart (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs space-y-4 h-[450px] flex flex-col justify-between">
              <div className="space-y-3">
                <div className="h-4 w-28 bg-slate-200 rounded" />
                <div className="space-y-2">
                  <div className="h-12 w-full bg-slate-50 rounded-lg" />
                  <div className="h-12 w-full bg-slate-50 rounded-lg" />
                </div>
              </div>

              <div className="space-y-2 pt-3 border-t border-slate-100">
                <div className="flex justify-between"><div className="h-3 w-16 bg-slate-200 rounded" /><div className="h-3 w-12 bg-slate-200 rounded" /></div>
                <div className="flex justify-between"><div className="h-3 w-20 bg-slate-200 rounded" /><div className="h-3 w-12 bg-slate-200 rounded" /></div>
                <div className="h-10 w-full bg-slate-900/40 rounded-xl mt-2" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
