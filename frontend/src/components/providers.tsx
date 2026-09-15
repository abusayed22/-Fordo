"use client";

import React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/react-query";
import { StoreCartProvider } from "@/context/store-cart-context";

export function Providers({ children }: Readonly<{ children: React.ReactNode }>) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
        <StoreCartProvider>{children}</StoreCartProvider>
    </QueryClientProvider>
  );
}
