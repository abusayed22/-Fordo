"use client";

import React from "react";
import { DashboardLayout } from "../dashboard-layout";

export function CustomerLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
