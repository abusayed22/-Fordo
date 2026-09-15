"use client";

import React from "react";
import Link from "next/link";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export function AccessDenied({
  pageTitle,
  allowedRoles = ["ADMIN"],
}: Readonly<{
  pageTitle: string;
  allowedRoles?: string[];
}>) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
      <div className="size-20 rounded-3xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 mb-6 shadow-xs">
        <ShieldAlert className="size-10" />
      </div>

      <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-100 text-rose-800 mb-3">
        Access Restricted
      </span>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        {pageTitle} (Admin Only)
      </h1>

      <p className="text-sm text-gray-600 max-w-md mb-6 leading-relaxed">
        This page requires{" "}
        <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
          {allowedRoles.join(", ")}
        </span>{" "}
        privileges as per business requirements.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/orders/new"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-all shadow-xs"
        >
          <ArrowLeft className="size-4" />
          Go to New Order Entry
        </Link>
      </div>
    </div>
  );
}
