import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

export interface StatCardProps {
  title: string;
  value: string | number;
  change: string;
  isPositive: boolean;
  bgColor?: string;
}

export function StatCard({
  title,
  value,
  change,
  isPositive,
  bgColor = "#ffffff",
}: StatCardProps) {
  return (
    <div
      className="p-3.5 sm:p-5 rounded-xl sm:rounded-2xl flex flex-col justify-between relative shadow-2xs border border-black/5 transition-transform"
      style={{ backgroundColor: bgColor }}
    >
      <div>
        <p className="text-[10px] sm:text-xs font-semibold text-slate-800/80 mb-1 sm:mb-1.5 uppercase tracking-wide truncate">
          {title}
        </p>
        <h3 className="text-lg sm:text-2xl lg:text-3xl font-extrabold text-slate-900 font-sans tracking-tight truncate">
          {value}
        </h3>
      </div>

      <div className="mt-2.5 sm:mt-4 flex items-center justify-between gap-1">
        <div className="flex items-center gap-0.5 sm:gap-1 bg-white/90 backdrop-blur-xs px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold shadow-2xs">
          <span className={isPositive ? "text-emerald-700" : "text-rose-700"}>
            {change}
          </span>
          {isPositive ? (
            <TrendingUp className="size-2.5 sm:size-3.5 text-emerald-700" />
          ) : (
            <TrendingDown className="size-2.5 sm:size-3.5 text-rose-700" />
          )}
        </div>
        <span className="text-[9px] sm:text-[11px] font-medium text-slate-600 hidden xs:inline">
          vs last mo
        </span>
      </div>
    </div>
  );
}
