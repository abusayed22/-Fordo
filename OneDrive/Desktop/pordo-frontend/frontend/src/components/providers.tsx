"use client";

import React, { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/react-query";
import { RoleProvider } from "@/context/role-context";
import { StoreCartProvider } from "@/context/store-cart-context";

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <RoleProvider>
        <StoreCartProvider>{children}</StoreCartProvider>
      </RoleProvider>
    </QueryClientProvider>
  );
}
