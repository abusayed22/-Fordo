



import React from "react";
import { StoreLayout } from "@/components/storefront/store-layout";

export default function RootStoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <StoreLayout>{children}</StoreLayout>;
}
