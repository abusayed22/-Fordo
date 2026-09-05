import React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

export default function SettingsLoading() {
  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-5 max-w-full overflow-hidden animate-pulse">
        {/* Header */}
        <div className="space-y-1">
          <div className="h-6 w-44 bg-slate-200 rounded-lg" />
          <div className="h-3 w-64 bg-slate-100 rounded-md" />
        </div>

        {/* Setting Card 1: Delivery Rates */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-2xs space-y-4">
          <div className="h-4 w-40 bg-slate-200 rounded" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="h-16 rounded-xl bg-slate-50 border border-slate-200/60 p-3 space-y-1.5" />
            <div className="h-16 rounded-xl bg-slate-50 border border-slate-200/60 p-3 space-y-1.5" />
          </div>
        </div>

        {/* Setting Card 2: Store Information */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-2xs space-y-3">
          <div className="h-4 w-36 bg-slate-200 rounded" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="h-10 bg-slate-50 rounded-lg" />
            <div className="h-10 bg-slate-50 rounded-lg" />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
