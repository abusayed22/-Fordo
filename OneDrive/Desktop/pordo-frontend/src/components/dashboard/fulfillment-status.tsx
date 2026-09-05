import React from "react";

export function FulfillmentStatus() {
  const fulfillment = [
    { label: "Shipped Orders", count: 85, percentage: 85, color: "bg-blue-500", bg: "bg-slate-100" },
    { label: "Delivered", count: 140, percentage: 92, color: "bg-emerald-500", bg: "bg-slate-100" },
    { label: "Pending Shipments", count: 28, percentage: 28, color: "bg-amber-500", bg: "bg-slate-100" },
    { label: "Hold Orders", count: 6, percentage: 6, color: "bg-slate-700", bg: "bg-slate-100" },
    { label: "Returned Items", count: 4, percentage: 4, color: "bg-rose-500", bg: "bg-slate-100" },
  ];

  return (
    <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs h-full flex flex-col justify-between">
      <div>
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
          Order Fulfillment
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">Courier dispatch & delivery velocity</p>
      </div>

      <div className="space-y-3.5 my-3.5">
        {fulfillment.map((item, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-700">{item.label}</span>
              <div className="flex items-center gap-1">
                <span className="font-bold text-slate-900">{item.count}</span>
                <span className="text-slate-400 text-[10px]">({item.percentage}%)</span>
              </div>
            </div>
            <div className={`w-full h-1.5 rounded-full overflow-hidden ${item.bg}`}>
              <div
                className={`h-full rounded-full transition-all duration-300 ${item.color}`}
                style={{ width: `${item.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
        <span className="text-[11px]">Average Dispatch</span>
        <span className="font-semibold text-slate-900 text-xs">4.5 Hours</span>
      </div>
    </div>
  );
}
