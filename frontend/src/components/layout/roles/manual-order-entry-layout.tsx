"use client";

import React from "react";
import { DashboardLayout } from "../dashboard-layout";

export function ManualOrderEntryLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
