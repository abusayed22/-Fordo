"use client";

import React, { useEffect } from "react";
import { DashboardLayout } from "../dashboard-layout";
import { useRole } from "@/context/role-context";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { role, setRole } = useRole();

  useEffect(() => {
    if (role !== "ADMIN") {
      setRole("ADMIN");
    }
  }, [role, setRole]);

  return <DashboardLayout>

    {children}
  </DashboardLayout>;
}
