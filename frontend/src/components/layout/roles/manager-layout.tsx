"use client";

import React from "react";
import { DashboardLayout } from "../dashboard-layout";

export function ManagerLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
