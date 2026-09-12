"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as LucideIcons from "lucide-react";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Store,
  HelpCircle,
} from "lucide-react";
import { useRole } from "@/context/role-context";
import { getDefaultDashboardRoute } from "@/lib/authUtils";
import { getNavItemsByRole } from "@/lib/navItems";
import { ScrollArea } from "@/components/ui/scroll-area";

// ১. স্ট্রিং আইকন ডায়নামিক্যালি রেন্ডার করার হেল্পার
const DynamicIcon = ({
  name,
  className = "size-4.5",
}: {
  name: string;
  className?: string;
}) => {
  const cleanName = name === "Calender" ? "Calendar" : name;
  const IconComponent =
    (LucideIcons as Record<string, any>)[cleanName] || HelpCircle;
  return <IconComponent className={className} />;
};

interface SidebarProps {
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export function Sidebar({
  isMobileOpen,
  setIsMobileOpen,
  isCollapsed,
  setIsCollapsed,
}: SidebarProps) {
  const pathname = usePathname();
  const { role, roleTitle, roleBadgeColor } = useRole();

  const navSections = getNavItemsByRole(role) || [];
  const homeDashboardUrl = getDefaultDashboardRoute(role);

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-xs xl:hidden animate-in fade-in"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 flex flex-col bg-[#0b1320] text-slate-200 border-r border-slate-800/80 rounded-tr-[30px] rounded-br-[30px] shadow-2xl transition-transform xl:transition-all duration-300 ease-in-out ${
          isCollapsed ? "w-[72px]" : "w-[280px] sm:w-[260px]"
        } ${
          isMobileOpen
            ? "translate-x-0 shadow-2xl"
            : "-translate-x-full xl:translate-x-0"
        }`}
      >
        {/* Fixed Brand Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800/60 relative rounded-tr-[30px] shrink-0">
          <Link
            href={homeDashboardUrl}
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
                    FORDO
                  </span>
                  <span
                    className="px-1.5 py-0.5 rounded text-[8px] font-extrabold tracking-wider text-white uppercase"
                    style={{ backgroundColor: roleBadgeColor || "#059669" }}
                  >
                    {role.replace("_", " ")}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium -mt-0.5">
                  Management Portal
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

          {/* Desktop Collapse Toggle */}
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

        {/* Minimal Role Indicator (Fixed) */}
        <div className="px-3 pt-3 shrink-0">
          <div
            className={`p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center ${
              isCollapsed && !isMobileOpen
                ? "justify-center"
                : "justify-between"
            }`}
          >
            {isCollapsed && !isMobileOpen ? (
              <span
                className="size-2.5 rounded-full"
                style={{ backgroundColor: roleBadgeColor || "#059669" }}
                title={`Role: ${roleTitle || role}`}
              />
            ) : (
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="size-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: roleBadgeColor || "#059669" }}
                />
                <span className="text-xs font-semibold text-slate-200 truncate">
                  {roleTitle || role}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Scrollable Navigation Area */}
        <ScrollArea className="flex-1 px-3 py-3 overflow-hidden">
          <div className="space-y-4">
            {navSections.map((section, sectionIdx) => (
              <div key={sectionIdx} className="space-y-1">
                {section.title && (!isCollapsed || isMobileOpen) && (
                  <div className="px-3 pb-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                    {section.title}
                  </div>
                )}

                <div className="space-y-0.5">
                  {section.items.map((item) => {
                    const isActive =
                      pathname === item.href ||
                      (item.href !== "/" &&
                        item.href !== homeDashboardUrl &&
                        pathname.startsWith(item.href));

                    return (
                      <Link
                        key={item.href + item.title}
                        href={item.href}
                        onClick={() => setIsMobileOpen(false)}
                        className={`group flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all touch-manipulation ${
                          isActive
                            ? "bg-slate-800 text-white shadow-xs"
                            : "text-slate-300 hover:text-white hover:bg-slate-800/60 active:bg-slate-800"
                        } ${
                          isCollapsed && !isMobileOpen ? "justify-center px-2" : ""
                        }`}
                        title={
                          isCollapsed && !isMobileOpen ? item.title : undefined
                        }
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <DynamicIcon
                            name={item.icon}
                            className={`size-4.5 shrink-0 transition-colors ${
                              isActive
                                ? "text-emerald-400"
                                : "text-slate-400 group-hover:text-slate-200"
                            }`}
                          />
                          {(!isCollapsed || isMobileOpen) && (
                            <span className="truncate">{item.title}</span>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Fixed Footer */}
        {(!isCollapsed || isMobileOpen) && (
          <div className="p-3.5 border-t border-slate-800/60 text-[11px] text-slate-400 flex items-center justify-between rounded-br-[30px] shrink-0">
            <Link
              href="/"
              className="hover:text-emerald-400 transition-colors"
            >
              ← View Store
            </Link>
            <span className="text-emerald-400 font-medium">● Online</span>
          </div>
        )}
      </aside>
    </>
  );
}