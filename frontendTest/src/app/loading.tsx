import React from "react";
import { Store } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4">
      <div className="flex flex-col items-center space-y-4 animate-in fade-in duration-300">
        {/* Animated Brand Pulse */}
        <div className="relative flex items-center justify-center">
          <div className="absolute size-16 rounded-2xl bg-emerald-400/20 animate-ping" />
          <div className="size-14 rounded-2xl bg-gradient-to-tr from-[#056D6E] to-[#044342] flex items-center justify-center text-white shadow-lg relative z-10">
            <Store className="size-7 text-white animate-pulse" />
          </div>
        </div>

        {/* Loading Text & Spinner */}
        <div className="text-center space-y-1">
          <h3 className="font-extrabold text-sm text-slate-900 tracking-tight font-sans">
            PORDO MART
          </h3>
          <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 font-medium">
            <div className="size-1.5 rounded-full bg-emerald-600 animate-bounce [animation-delay:-0.3s]" />
            <div className="size-1.5 rounded-full bg-emerald-600 animate-bounce [animation-delay:-0.15s]" />
            <div className="size-1.5 rounded-full bg-emerald-600 animate-bounce" />
            <span className="ml-1 text-[11px] text-slate-400 font-medium">Loading content...</span>
          </div>
        </div>
      </div>
    </div>
  );
}
