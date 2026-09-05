import React from "react";
import { StoreLayout } from "@/components/storefront/store-layout";

export default function CommonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
