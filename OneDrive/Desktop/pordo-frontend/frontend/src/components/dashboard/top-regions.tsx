import React from "react";
import { MapPin } from "lucide-react";

export function TopRegions() {
  const regions = [
    { name: "Dhaka Metro", sales: "৳5,80,000", orders: 340, percent: 58, badge: "Inside Dhaka" },
    { name: "Chittagong", sales: "৳2,10,000", orders: 120, percent: 21, badge: "Outside Dhaka" },
    { name: "Sylhet", sales: "৳1,10,000", orders: 64, percent: 11, badge: "Outside Dhaka" },
    { name: "Rajshahi", sales: "৳65,000", orders: 38, percent: 6, badge: "Outside Dhaka" },
    { name: "Khulna", sales: "৳45,000", orders: 26, percent: 4, badge: "Outside Dhaka" },
  ];

  return (
    <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs h-full flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
            Top Regions
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">District distribution & delivery zones</p>
        </div>
        <div className="size-7 rounded-lg bg-slate-50 text-slate-700 flex items-center justify-center border border-slate-200/60">
          <MapPin className="size-3.5" />
        </div>
      </div>

      <div className="space-y-2.5 my-3">
        {regions.map((region, idx) => (
          <div key={idx} className="p-2 rounded-lg hover:bg-slate-50 transition-colors">
            <div className="flex items-center justify-between text-xs mb-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-900">{region.name}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-medium">
                  {region.badge}
                </span>
              </div>
              <div className="text-right">
                <span className="font-bold text-slate-900">{region.sales}</span>
                <span className="text-slate-400 text-[10px] ml-1">({region.orders})</span>
              </div>
            </div>
            <div className="w-full h-1 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-slate-900"
                style={{ width: `${region.percent}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
        <span className="text-[11px]">Active Coverage</span>
        <span className="font-semibold text-slate-900 text-xs">All 64 Districts</span>
      </div>
    </div>
  );
}
