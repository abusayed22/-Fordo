import React from "react";
import {
  Truck,
  RotateCcw,
  ShieldCheck,
  Headset,
  Banknote,
} from "lucide-react";

export function FeaturesBanner() {
  const features = [
    {
      icon: Truck,
      title: "Fast Delivery",
      desc: "Dhaka 24H & nationwide courier",
      color: "text-emerald-700 bg-emerald-50",
    },
    {
      icon: RotateCcw,
      title: "Easy 3-Day Return",
      desc: "Hassle-free size exchange",
      color: "text-blue-700 bg-blue-50",
    },
    {
      icon: ShieldCheck,
      title: "100% Authentic",
      desc: "Premium quality guaranteed",
      color: "text-purple-700 bg-purple-50",
    },
    {
      icon: Headset,
      title: "24/7 Support",
      desc: "Call +880 1700-112233",
      color: "text-amber-700 bg-amber-50",
    },
    {
      icon: Banknote,
      title: "Cash On Delivery",
      desc: "Pay upon parcel check",
      color: "text-rose-700 bg-rose-50",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-6 py-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 p-4 sm:p-6 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
        {features.map((feat, idx) => (
          <div key={idx} className="flex items-center gap-3 p-2">
            <div className={`size-11 rounded-xl flex items-center justify-center shrink-0 ${feat.color}`}>
              <feat.icon className="size-5.5" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-slate-900 leading-tight">
                {feat.title}
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">{feat.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
