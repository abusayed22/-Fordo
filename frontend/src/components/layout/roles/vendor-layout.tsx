"use client";

import React from "react";
import { DashboardLayout } from "../dashboard-layout";

export function VendorLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
