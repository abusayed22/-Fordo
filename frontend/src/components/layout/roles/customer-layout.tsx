"use client";

import React, { useEffect } from "react";
import { DashboardLayout } from "../dashboard-layout";
import { useRole } from "@/context/role-context";

export function CustomerLayout({ children }: { children: React.ReactNode }) {
  const { role, setRole } = useRole();

  useEffect(() => {
    if (role !== "CUSTOMER") {
      setRole("CUSTOMER");
    }
  }, [role, setRole]);

  return <DashboardLayout>{children}</DashboardLayout>;
}
