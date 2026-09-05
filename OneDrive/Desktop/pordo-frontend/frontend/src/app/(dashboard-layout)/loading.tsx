import React from "react";

export default function DashboardLoading() {
  return (
    <div className="p-4 sm:p-6 space-y-5 animate-pulse max-w-full overflow-hidden">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-6 w-44 bg-slate-200 rounded-lg" />
          <div className="h-3.5 w-64 bg-slate-100 rounded-md" />
        </div>
        <div className="h-9 w-28 bg-slate-200 rounded-xl" />
      </div>

      {/* 4 Pastel Stat Card Skeletons */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-24 rounded-2xl bg-slate-100 border border-slate-200/60 p-4 flex flex-col justify-between"
          >
            <div className="h-3 w-20 bg-slate-200 rounded" />
            <div className="h-7 w-28 bg-slate-200 rounded-md" />
          </div>
        ))}
      </div>

      {/* Main Table / Chart Skeleton */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4">
        <div className="h-4 w-32 bg-slate-200 rounded" />
        <div className="space-y-2.5">
          {[1, 2, 3, 4, 5].map((row) => (
            <div key={row} className="h-10 w-full bg-slate-50 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
