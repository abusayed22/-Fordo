"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRole, UserRole } from "@/context/role-context";
import {
  LayoutDashboard,
  PlusCircle,
  ShoppingBag,
  Users,
  Package,
  Boxes,
  FolderTree,
  Award,
  TicketPercent,
  UserCheck,
  Settings,
  ChevronLeft,
  ChevronRight,
  Store,
  X,
  Truck,
  Heart,
  Store as StoreIcon,
  Warehouse,
  ClipboardList,
  DollarSign,
  MapPin,
  Clock,
} from "lucide-react";

interface MenuItem {
  title: string;
  banglaTitle: string;
  path: string;
  icon: React.ElementType;
  roles?: UserRole[]; // If specified, only visible to these roles
  badge?: string;
  badgeColor?: string;
}

interface MenuGroup {
  groupTitle: string;
  items: MenuItem[];
}

export function Sidebar({
  isMobileOpen,
  setIsMobileOpen,
  isCollapsed,
  setIsCollapsed,
}: {
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}) {
  const pathname = usePathname();
  const { role, roleTitle, roleBadgeColor, isAdmin, isManager, isCustomer, isVendor, isDeliveryMan, isWarehouseManager, isManualOrderEntry } = useRole();

  // Role-tailored menu configuration
  const getMenuGroupsForRole = (): MenuGroup[] => {
    // 1. CUSTOMER
    if (isCustomer) {
      return [
        {
          groupTitle: "MY ACCOUNT",
          items: [
            {
              title: "My Orders",
              banglaTitle: "আমার অর্ডারসমূহ",
              path: "/orders",
              icon: ShoppingBag,
              badge: "History",
              badgeColor: "bg-purple-500/20 text-purple-300 border border-purple-500/30",
            },
            {
              title: "Track Delivery",
              banglaTitle: "ডেলিভারি ট্র্যাকিং",
              path: "/orders",
              icon: Truck,
            },
            {
              title: "Browse Store",
              banglaTitle: "শপিং করুন",
              path: "/",
              icon: Store,
              badge: "Shop",
              badgeColor: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
            },
          ],
        },
      ];
    }

    // 2. VENDOR / MERCHANT
    if (isVendor) {
      return [
        {
          groupTitle: "MERCHANT PORTAL",
          items: [
            {
              title: "Vendor Dashboard",
              banglaTitle: "ভেন্ডর ড্যাশবোর্ড",
              path: "/dashboard",
              icon: LayoutDashboard,
            },
            {
              title: "Vendor Products",
              banglaTitle: "আমার প্রোডাক্টস",
              path: "/products",
              icon: Package,
              badge: "Catalog",
              badgeColor: "bg-pink-500/20 text-pink-300 border border-pink-500/30",
            },
            {
              title: "Brand Profile",
              banglaTitle: "ব্র্যান্ড প্রোফাইল",
              path: "/brands",
              icon: Award,
            },
            {
              title: "Vendor Orders",
              banglaTitle: "অর্ডার তালিকা",
              path: "/orders",
              icon: ShoppingBag,
            },
          ],
        },
      ];
    }

    // 3. DELIVERY MAN / RIDER
    if (isDeliveryMan) {
      return [
        {
          groupTitle: "RIDER CONSOLE",
          items: [
            {
              title: "Assigned Deliveries",
              banglaTitle: "ডেলিভারি টাস্ক",
              path: "/orders",
              icon: Truck,
              badge: "Active",
              badgeColor: "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30",
            },
            {
              title: "Customer Database",
              banglaTitle: "কাস্টমার ঠিকানা",
              path: "/customers",
              icon: MapPin,
            },
          ],
        },
      ];
    }

    // 4. WAREHOUSE MANAGER
    if (isWarehouseManager) {
      return [
        {
          groupTitle: "INVENTORY & DEPOT",
          items: [
            {
              title: "Stock Control",
              banglaTitle: "স্টক ও ইনভেন্টরি",
              path: "/inventory",
              icon: Boxes,
              badge: "Low Stock",
              badgeColor: "bg-rose-500/20 text-rose-300 border border-rose-500/30",
            },
            {
              title: "Product Catalog",
              banglaTitle: "প্রোডাক্টস",
              path: "/products",
              icon: Package,
            },
            {
              title: "Categories",
              banglaTitle: "ক্যাটাগরি",
              path: "/categories",
              icon: FolderTree,
            },
            {
              title: "Supplier Brands",
              banglaTitle: "ব্র্যান্ডস",
              path: "/brands",
              icon: Award,
            },
          ],
        },
      ];
    }

    // 5. MANUAL ORDER ENTRY (POS Officer)
    if (isManualOrderEntry) {
      return [
        {
          groupTitle: "ORDER COUNTER",
          items: [
            {
              title: "New Order (POS)",
              banglaTitle: "নতুন অর্ডার এন্ট্রি",
              path: "/orders/new",
              icon: PlusCircle,
              badge: "Fast POS",
              badgeColor: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
            },
            {
              title: "Orders List",
              banglaTitle: "সব অর্ডার",
              path: "/orders",
              icon: ShoppingBag,
            },
            {
              title: "Customer Search",
              banglaTitle: "কাস্টমার ডাটাবেজ",
              path: "/customers",
              icon: Users,
            },
            {
              title: "Live Stock Check",
              banglaTitle: "প্রোডাক্টস ও স্টক",
              path: "/products",
              icon: Package,
            },
          ],
        },
      ];
    }

    // 6 & 7. ADMIN & MANAGER (Full or Operational Access)
    return [
      {
        groupTitle: "OVERVIEW",
        items: [
          {
            title: "Dashboard",
            banglaTitle: "ড্যাশবোর্ড / ওভারভিউ",
            path: "/dashboard",
            icon: LayoutDashboard,
          },
        ],
      },
      {
        groupTitle: "ORDERS & CLIENTS",
        items: [
          {
            title: "New Order",
            banglaTitle: "নতুন অর্ডার এন্ট্রি",
            path: "/orders/new",
            icon: PlusCircle,
            badge: "POS",
            badgeColor: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
          },
          {
            title: "Orders List",
            banglaTitle: "সব অর্ডার তালিকা",
            path: "/orders",
            icon: ShoppingBag,
            badge: "Live",
            badgeColor: "bg-slate-800 text-slate-300 border border-slate-700",
          },
          {
            title: "Customers",
            banglaTitle: "কাস্টমার ডাটাবেজ",
            path: "/customers",
            icon: Users,
          },
        ],
      },
      {
        groupTitle: "CATALOG & STOCK",
        items: [
          {
            title: "Products",
            banglaTitle: "প্রোডাক্টস",
            path: "/products",
            icon: Package,
          },
          {
            title: "Categories",
            banglaTitle: "ক্যাটাগরি",
            path: "/categories",
            icon: FolderTree,
            badge: "CRUD",
            badgeColor: "bg-blue-500/20 text-blue-300 border border-blue-500/30",
          },
          {
            title: "Brands",
            banglaTitle: "ব্র্যান্ডস",
            path: "/brands",
            icon: Award,
            badge: "CRUD",
            badgeColor: "bg-purple-500/20 text-purple-300 border border-purple-500/30",
          },
          {
            title: "Inventory",
            banglaTitle: "স্টক ও ইনভেন্টরি",
            path: "/inventory",
            icon: Boxes,
            badge: "Low",
            badgeColor: "bg-rose-500/20 text-rose-300 border border-rose-500/30",
          },
        ],
      },
      {
        groupTitle: "MARKETING & TEAM",
        items: [
          {
            title: "Coupons",
            banglaTitle: "কুপন ও ডিসকাউন্ট",
            path: "/discounts",
            icon: TicketPercent,
          },
          ...(isAdmin
            ? [
                {
                  title: "Officers & Roles",
                  banglaTitle: "অফিসার ও রোলস",
                  path: "/settings/users",
                  icon: UserCheck,
                },
              ]
            : []),
        ],
      },
      {
        groupTitle: "CONFIGURATION",
        items: [
          {
            title: "Settings",
            banglaTitle: "ডেলিভারি ও সেটিংস",
            path: "/settings",
            icon: Settings,
          },
        ],
      },
    ];
  };

  const menuGroups = getMenuGroupsForRole();

  return (
    <>
      {/* Mobile Backdrop with touch dismiss */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-xs xl:hidden animate-in fade-in"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar: Always on LEFT, with stylish Angled-Rounded Top-Right & Bottom-Right Corners */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 flex flex-col bg-[#0b1320] text-slate-200 border-r border-slate-800/80 rounded-tr-[30px] rounded-br-[30px] shadow-2xl transition-transform xl:transition-all duration-300 ease-in-out ${
          isCollapsed ? "w-[72px]" : "w-[280px] sm:w-[260px]"
        } ${
          isMobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full xl:translate-x-0"
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800/60 relative rounded-tr-[30px]">
          <Link
            href={role === "CUSTOMER" ? "/" : role === "MANUAL_ORDER_ENTRY" ? "/orders/new" : "/dashboard"}
            onClick={() => setIsMobileOpen(false)}
            className="flex items-center gap-3 overflow-hidden group"
          >
            <div className="size-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-800 flex items-center justify-center text-white font-bold shadow-xs shrink-0 transition-transform group-hover:scale-105">
              <Store className="size-4.5 text-white" />
            </div>
            {(!isCollapsed || isMobileOpen) && (
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm tracking-tight text-white font-sans">
                    PORDO
                  </span>
                  <span
                    className="px-1.5 py-0.5 rounded text-[8px] font-extrabold tracking-wider text-white uppercase"
                    style={{ backgroundColor: roleBadgeColor }}
                  >
                    {role.replace("_", " ")}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium -mt-0.5">
                  Store Management
                </span>
              </div>
            )}
          </Link>

          {/* Mobile Close Button */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="xl:hidden size-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center cursor-pointer"
            aria-label="Close menu"
          >
            <X className="size-4" />
          </button>

          {/* Desktop Collapse Toggle on the Right Edge */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden xl:flex size-6 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 items-center justify-center absolute -right-3 top-1/2 -translate-y-1/2 shadow-md cursor-pointer border border-slate-700 transition-colors z-50"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="size-3.5" />
            ) : (
              <ChevronLeft className="size-3.5" />
            )}
          </button>
        </div>

        {/* Minimal Role Pill */}
        <div className="px-3 pt-3">
          <div
            className={`p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center ${
              isCollapsed && !isMobileOpen ? "justify-center" : "justify-between"
            }`}
          >
            {isCollapsed && !isMobileOpen ? (
              <span
                className="size-2.5 rounded-full"
                style={{ backgroundColor: roleBadgeColor }}
                title={`Role: ${roleTitle}`}
              />
            ) : (
              <>
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="size-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: roleBadgeColor }}
                  />
                  <span className="text-xs font-semibold text-slate-200 truncate">
                    {roleTitle}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 px-3 py-3 overflow-y-auto custom-scrollbar space-y-4">
          {menuGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="space-y-1">
              {(!isCollapsed || isMobileOpen) && (
                <div className="px-3 pb-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  {group.groupTitle}
                </div>
              )}
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive =
                    pathname === item.path ||
                    (item.path !== "/dashboard" &&
                      item.path !== "/" &&
                      pathname.startsWith(item.path));

                  return (
                    <Link
                      key={item.path + item.title}
                      href={item.path}
                      onClick={() => setIsMobileOpen(false)}
                      className={`group flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all touch-manipulation ${
                        isActive
                          ? "bg-slate-800 text-white shadow-xs"
                          : "text-slate-300 hover:text-white hover:bg-slate-850 active:bg-slate-800"
                      } ${isCollapsed && !isMobileOpen ? "justify-center px-2" : ""}`}
                      title={isCollapsed && !isMobileOpen ? item.title : undefined}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <item.icon
                          className={`size-4.5 shrink-0 transition-colors ${
                            isActive ? "text-emerald-400" : "text-slate-400 group-hover:text-slate-200"
                          }`}
                        />
                        {(!isCollapsed || isMobileOpen) && (
                          <span className="truncate">{item.title}</span>
                        )}
                      </div>

                      {(!isCollapsed || isMobileOpen) && item.badge && (
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold shrink-0 ${item.badgeColor}`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        {(!isCollapsed || isMobileOpen) && (
          <div className="p-3.5 border-t border-slate-800/60 text-[11px] text-slate-400 flex items-center justify-between rounded-br-[30px]">
            <Link href="/" className="hover:text-emerald-400 transition-colors">
              ← View Store
            </Link>
            <span className="text-emerald-400 font-medium">● Online</span>
          </div>
        )}
      </aside>
    </>
  );
}
