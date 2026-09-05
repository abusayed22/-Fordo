"use client";

import React, { useEffect } from "react";
import { DashboardLayout } from "../dashboard-layout";
import { useRole } from "@/context/role-context";

export function ManagerLayout({ children }: { children: React.ReactNode }) {
  const { role, setRole } = useRole();

  useEffect(() => {
    if (role !== "MANAGER") {
      setRole("MANAGER");
    }
  }, [role, setRole]);

  return <DashboardLayout>{children}</DashboardLayout>;
}
