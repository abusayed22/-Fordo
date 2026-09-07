"use client";

import React, { useState } from "react";
import { ArrowUpRight } from "lucide-react";

export function RevenueChart() {
  const [activeRange, setActiveRange] = useState<"2026" | "30D">("2026");

  const monthlyData = [
    { label: "Jan", revenue: 45000, profit: 18000 },
    { label: "Feb", revenue: 52000, profit: 22000 },
    { label: "Mar", revenue: 48000, profit: 19500 },
    { label: "Apr", revenue: 68000, profit: 28000 },
    { label: "May", revenue: 75000, profit: 31000 },
    { label: "Jun", revenue: 89000, profit: 39000 },
    { label: "Jul", revenue: 95000, profit: 42000 },
    { label: "Aug", revenue: 110000, profit: 49000 },
    { label: "Sep", revenue: 128450, profit: 54200 },
    { label: "Oct", revenue: 115000, profit: 48000 },
    { label: "Nov", revenue: 135000, profit: 59000 },
    { label: "Dec", revenue: 148000, profit: 64000 },
  ];

  const maxVal = 160000;

  return (
    <div className="bg-white border border-slate-200/80 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wide">
              Revenue & Profit
            </h3>
            <span className="flex items-center gap-0.5 text-[10px] sm:text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-md">
              <ArrowUpRight className="size-2.5 sm:size-3" /> +28.4%
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
            Monthly sales revenue and net margin
          </p>
        </div>

        {/* Minimal Controls */}
        <div className="flex items-center justify-between sm:justify-end gap-3 pt-1 sm:pt-0">
          <div className="flex items-center gap-2.5 text-[11px]">
            <span className="flex items-center gap-1 text-slate-600 font-medium">
              <span className="size-2 rounded-sm bg-slate-900" />
              Rev
            </span>
            <span className="flex items-center gap-1 text-slate-600 font-medium">
              <span className="size-2 rounded-sm bg-emerald-500" />
              Prof
            </span>
          </div>

          <div className="flex p-0.5 bg-slate-100 rounded-lg text-xs">
            <button
              onClick={() => setActiveRange("2026")}
              className={`px-2 py-0.5 rounded-md transition-all font-medium text-[11px] cursor-pointer ${
                activeRange === "2026"
                  ? "bg-white text-slate-900 shadow-2xs font-semibold"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              2026
            </button>
            <button
              onClick={() => setActiveRange("30D")}
              className={`px-2 py-0.5 rounded-md transition-all font-medium text-[11px] cursor-pointer ${
                activeRange === "30D"
                  ? "bg-white text-slate-900 shadow-2xs font-semibold"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              30D
            </button>
          </div>
        </div>
      </div>

      {/* Chart Bars (Scrollable on extra narrow screens if needed, otherwise responsive) */}
      <div className="w-full overflow-x-auto custom-scrollbar-gray pb-1">
        <div className="min-w-[280px] h-48 sm:h-56 flex items-end justify-between gap-1 sm:gap-1.5 pt-4 pb-2 px-1 border-b border-slate-100">
          {monthlyData.map((item, idx) => {
            const revHeight = Math.round((item.revenue / maxVal) * 100);
            const profHeight = Math.round((item.profit / maxVal) * 100);

            return (
              <div
                key={idx}
                className="flex-1 flex flex-col items-center h-full justify-end group relative cursor-pointer"
              >
                {/* Minimal Tooltip */}
                <div className="absolute -top-10 z-20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-slate-900 text-white text-[9px] rounded py-0.5 px-1.5 shadow-md whitespace-nowrap">
                  <span>৳{item.revenue.toLocaleString()}</span>
                </div>

                {/* Bars */}
                <div className="w-full max-w-[14px] sm:max-w-[20px] flex items-end justify-center gap-0.5 sm:gap-1 h-full">
                  <div
                    className="w-1/2 bg-slate-800 rounded-t-xs transition-all duration-200"
                    style={{ height: `${revHeight}%` }}
                  />
                  <div
                    className="w-1/2 bg-emerald-500 rounded-t-xs transition-all duration-200"
                    style={{ height: `${profHeight}%` }}
                  />
                </div>

                <span className="text-[9px] sm:text-[10px] font-medium text-slate-400 mt-1.5">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Metrics Grid (2x2 on Mobile, 4x1 on Desktop) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-3 pt-1 text-xs">
        <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
          <span className="text-slate-400 text-[10px] block">Monthly Avg</span>
          <p className="font-bold text-slate-900 mt-0.5">৳92,450</p>
        </div>
        <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
          <span className="text-slate-400 text-[10px] block">Profit Margin</span>
          <p className="font-bold text-emerald-600 mt-0.5">42.2%</p>
        </div>
        <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
          <span className="text-slate-400 text-[10px] block">Total Orders</span>
          <p className="font-bold text-slate-900 mt-0.5">4,820</p>
        </div>
        <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
          <span className="text-slate-400 text-[10px] block">Avg Order</span>
          <p className="font-bold text-slate-900 mt-0.5">৳2,480</p>
        </div>
      </div>
    </div>
  );
}
