"use client";

import React, { useEffect } from "react";
import { DashboardLayout } from "../dashboard-layout";
import { useRole } from "@/context/role-context";

export function ManualOrderEntryLayout({ children }: { children: React.ReactNode }) {
  const { role, setRole } = useRole();

  useEffect(() => {
    if (role !== "MANUAL_ORDER_ENTRY") {
      setRole("MANUAL_ORDER_ENTRY");
    }
  }, [role, setRole]);

  return <DashboardLayout>{children}</DashboardLayout>;
}
