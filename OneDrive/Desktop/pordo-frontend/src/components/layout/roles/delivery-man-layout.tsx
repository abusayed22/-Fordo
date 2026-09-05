"use client";

import React, { useEffect } from "react";
import { DashboardLayout } from "../dashboard-layout";
import { useRole } from "@/context/role-context";

export function DeliveryManLayout({ children }: { children: React.ReactNode }) {
  const { role, setRole } = useRole();

  useEffect(() => {
    if (role !== "DELIVERY_MAN") {
      setRole("DELIVERY_MAN");
    }
  }, [role, setRole]);

  return <DashboardLayout>{children}</DashboardLayout>;
}
