"use client";

import React from "react";

export function OrderStatusDonut() {
  const statusItems = [
    { label: "New Shipment", count: 60, color: "#10B981" },
    { label: "Processing", count: 24, color: "#3B82F6" },
    { label: "Delivered", count: 140, color: "#F59E0B" },
    { label: "Cancelled", count: 12, color: "#EF4444" },
    { label: "Failed Delivery", count: 10, color: "#F97316" },
    { label: "Pending", count: 18, color: "#8B5CF6" },
    { label: "Returned", count: 16, color: "#EC4899" },
    { label: "Refunded", count: 8, color: "#0F766E" },
  ];

  const total = statusItems.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="bg-white border border-slate-200/80 rounded-xl p-4 sm:p-5 shadow-xs h-full flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
            Order Status
          </h3>
          <p className="text-xs text-slate-400">Live order fulfillment stages</p>
        </div>
        <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
          {total} Orders
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 my-3">
        {/* Responsive Donut SVG */}
        <div className="relative size-32 sm:size-36 shrink-0 flex items-center justify-center">
          <svg className="size-full -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-slate-100"
              strokeWidth="3.5"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            {(() => {
              let cumulative = 0;
              return statusItems.map((item, i) => {
                const percent = (item.count / total) * 100;
                const offset = 100 - cumulative;
                cumulative += percent;
                return (
                  <circle
                    key={i}
                    r="15.9155"
                    cx="18"
                    cy="18"
                    fill="transparent"
                    stroke={item.color}
                    strokeWidth="3.5"
                    strokeDasharray={`${percent} ${100 - percent}`}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    className="transition-all duration-300"
                  />
                );
              });
            })()}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-lg sm:text-xl font-extrabold text-slate-900">{total}</span>
            <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">
              Total
            </span>
          </div>
        </div>

        {/* Legend Grid */}
        <div className="w-full flex-1 grid grid-cols-2 gap-x-2.5 gap-y-1.5 text-xs">
          {statusItems.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between py-0.5"
            >
              <div className="flex items-center gap-1.5 truncate">
                <span
                  className="size-2 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-slate-600 text-[10.5px] sm:text-[11px] truncate">
                  {item.label}
                </span>
              </div>
              <span className="font-semibold text-slate-900 text-[11px] ml-1">
                {item.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span className="text-[11px]">Delivery Success</span>
        <span className="font-bold text-emerald-600 text-xs">92.4%</span>
      </div>
    </div>
  );
}
