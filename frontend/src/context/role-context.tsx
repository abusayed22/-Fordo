"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type UserRole =
  | "ADMIN"
  | "MANAGER"
  | "CUSTOMER"
  | "VENDOR"
  | "DELIVERY_MAN"
  | "WAREHOUSE_MANAGER"
  | "MANUAL_ORDER_ENTRY";

export interface RoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  isAdmin: boolean;
  isManager: boolean;
  isCustomer: boolean;
  isVendor: boolean;
  isDeliveryMan: boolean;
  isWarehouseManager: boolean;
  isManualOrderEntry: boolean;
  hasAdminOrManager: boolean;
  hasManagerAccess: boolean;
  canAccessRoute: (path: string) => boolean;
  roleTitle: string;
  roleBadgeColor: string;
}

const defaultRoleContext: RoleContextType = {
  role: "ADMIN",
  setRole: () => {},
  isAdmin: true,
  isManager: false,
  isCustomer: false,
  isVendor: false,
  isDeliveryMan: false,
  isWarehouseManager: false,
  isManualOrderEntry: false,
  hasAdminOrManager: true,
  hasManagerAccess: true,
  canAccessRoute: () => true,
  roleTitle: "Super Admin",
  roleBadgeColor: "#10B981",
};

const RoleContext = createContext<RoleContextType>(defaultRoleContext);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<UserRole>("ADMIN");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("pordo_user_role") as UserRole | null;
      if (
        saved &&
        [
          "ADMIN",
          "MANAGER",
          "CUSTOMER",
          "VENDOR",
          "DELIVERY_MAN",
          "WAREHOUSE_MANAGER",
          "MANUAL_ORDER_ENTRY",
        ].includes(saved)
      ) {
        setRoleState(saved);
      }
    } catch {
      // ignore
    }
  }, []);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("pordo_user_role", newRole);
      }
    } catch {
      // ignore
    }
  };

  const isAdmin = role === "ADMIN";
  const isManager = role === "MANAGER";
  const isCustomer = role === "CUSTOMER";
  const isVendor = role === "VENDOR";
  const isDeliveryMan = role === "DELIVERY_MAN";
  const isWarehouseManager = role === "WAREHOUSE_MANAGER";
  const isManualOrderEntry = role === "MANUAL_ORDER_ENTRY";
  const hasAdminOrManager = isAdmin || isManager;
  const hasManagerAccess = isAdmin || isManager;

  const getRoleMetadata = () => {
    switch (role) {
      case "ADMIN":
        return { title: "Super Admin (Full Access)", badgeColor: "#10B981" };
      case "MANAGER":
        return { title: "Operations Manager", badgeColor: "#3B82F6" };
      case "CUSTOMER":
        return { title: "Customer Portal", badgeColor: "#8B5CF6" };
      case "VENDOR":
        return { title: "Merchant / Vendor", badgeColor: "#EC4899" };
      case "DELIVERY_MAN":
        return { title: "Delivery Rider", badgeColor: "#06B6D4" };
      case "WAREHOUSE_MANAGER":
        return { title: "Warehouse & Stock Mgr", badgeColor: "#F97316" };
      case "MANUAL_ORDER_ENTRY":
        return { title: "Order Entry Officer (POS)", badgeColor: "#F59E0B" };
    }
  };

  const { title: roleTitle, badgeColor: roleBadgeColor } = getRoleMetadata();

  const canAccessRoute = (path: string): boolean => {
    if (isAdmin) return true;

    if (isManager) {
      return (
        path.startsWith("/dashboard") ||
        path.startsWith("/orders") ||
        path.startsWith("/customers") ||
        path.startsWith("/products") ||
        path.startsWith("/categories") ||
        path.startsWith("/brands") ||
        path.startsWith("/inventory") ||
        path.startsWith("/discounts") ||
        path.startsWith("/settings")
      );
    }

    if (isManualOrderEntry) {
      return (
        path.startsWith("/orders/new") ||
        path.startsWith("/orders") ||
        path.startsWith("/customers") ||
        path.startsWith("/products") ||
        path.startsWith("/categories") ||
        path.startsWith("/brands")
      );
    }

    if (isWarehouseManager) {
      return (
        path.startsWith("/inventory") ||
        path.startsWith("/products") ||
        path.startsWith("/categories") ||
        path.startsWith("/brands") ||
        path.startsWith("/dashboard")
      );
    }

    if (isDeliveryMan) {
      return path.startsWith("/orders") || path.startsWith("/customers");
    }

    if (isVendor) {
      return (
        path.startsWith("/products") ||
        path.startsWith("/brands") ||
        path.startsWith("/orders") ||
        path.startsWith("/dashboard")
      );
    }

    if (isCustomer) {
      return path.startsWith("/orders") || path === "/" || path.startsWith("/#");
    }

    return false;
  };

  return (
    <RoleContext.Provider
      value={{
        role,
        setRole,
        isAdmin,
        isManager,
        isCustomer,
        isVendor,
        isDeliveryMan,
        isWarehouseManager,
        isManualOrderEntry,
        hasAdminOrManager,
        hasManagerAccess,
        canAccessRoute,
        roleTitle,
        roleBadgeColor,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  return context || defaultRoleContext;
}
