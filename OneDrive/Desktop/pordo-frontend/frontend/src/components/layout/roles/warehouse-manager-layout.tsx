"use client";

import React, { useEffect } from "react";
import { DashboardLayout } from "../dashboard-layout";
import { useRole } from "@/context/role-context";

export function WarehouseManagerLayout({ children }: { children: React.ReactNode }) {
  const { role, setRole } = useRole();

  useEffect(() => {
    if (role !== "WAREHOUSE_MANAGER") {
      setRole("WAREHOUSE_MANAGER");
    }
  }, [role, setRole]);

  return <DashboardLayout>{children}</DashboardLayout>;
}
