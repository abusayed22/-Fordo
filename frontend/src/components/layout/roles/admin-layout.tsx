"use client";

import React from "react";
import { DashboardLayout as BaseDashboardLayout } from "../dashboard-layout";

export function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {


  return <BaseDashboardLayout>

    {children}
  </BaseDashboardLayout>;
}
