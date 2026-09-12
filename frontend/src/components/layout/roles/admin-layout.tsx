"use client";

import React, { useEffect } from "react";
import { DashboardLayout } from "../dashboard-layout";
import { useRole } from "@/context/role-context";

export function DashboardLayout({ children }: { children: React.ReactNode }) {


  return <DashboardLayout>

    {children}
  </DashboardLayout>;
}
