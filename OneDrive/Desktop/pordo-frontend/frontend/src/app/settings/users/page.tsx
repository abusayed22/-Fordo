"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useRole } from "@/context/role-context";
import { AccessDenied } from "@/components/common/access-denied";
import { mockStaff, StaffUser } from "@/lib/mock-data";
import {
  Plus,
  Mail,
  Phone,
  X,
  Shield,
} from "lucide-react";

export default function OfficersUsersPage() {
  const { isAdmin } = useRole();
  const [officerList, setOfficerList] = useState<StaffUser[]>(mockStaff);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Officer form
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newRole, setNewRole] = useState<"ADMIN" | "MANAGER" | "MANUAL_ORDER_ENTRY">("MANUAL_ORDER_ENTRY");

  if (!isAdmin) {
    return (
      <DashboardLayout>
        <AccessDenied pageTitle="Officers & Role Management" allowedRoles={["ADMIN"]} />
      </DashboardLayout>
    );
  }

  const handleRoleChange = (id: string, role: "ADMIN" | "MANAGER" | "MANUAL_ORDER_ENTRY") => {
    setOfficerList(
      officerList.map((s) => (s.id === id ? { ...s, role } : s))
    );
  };

  const handleAddOfficer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail || !newPhone) return;

    const user: StaffUser = {
      id: `usr-${Date.now()}`,
      name: newName,
      email: newEmail,
      phone: newPhone,
      role: newRole,
      status: "Active",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
      lastLogin: "Invited",
      createdDate: new Date().toISOString().split("T")[0],
    };

    setOfficerList([...officerList, user]);
    setIsModalOpen(false);
    setNewName("");
    setNewEmail("");
    setNewPhone("");
  };

  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Officers & Role Management
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Create accounts and assign permissions (ADMIN, MANAGER, MANUAL_ORDER_ENTRY)
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 shadow-xs transition-all cursor-pointer self-start sm:self-auto"
          >
            <Plus className="size-3.5" />
            <span>Add Officer / Manager</span>
          </button>
        </div>

        {/* Minimal Table */}
        <div className="bg-white border border-slate-200/80 rounded-xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar-gray">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 text-slate-500 font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4 sm:px-5">User</th>
                  <th className="py-3 px-3">Contact</th>
                  <th className="py-3 px-3">Assigned Role</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Last Active</th>
                  <th className="py-3 px-4 sm:px-5 text-right">Change Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {officerList.map((officer) => (
                  <tr key={officer.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 sm:px-5">
                      <div className="flex items-center gap-3">
                        <img
                          src={officer.avatar}
                          alt={officer.name}
                          className="size-8 rounded-full object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <p className="font-semibold text-slate-900">{officer.name}</p>
                          <span className="text-[10px] text-slate-400">
                            Joined {officer.createdDate}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="text-slate-800">{officer.email}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {officer.phone}
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-md border ${
                          officer.role === "ADMIN"
                            ? "bg-slate-900 text-white border-slate-900"
                            : officer.role === "MANAGER"
                            ? "bg-blue-50 text-blue-800 border-blue-200"
                            : "bg-slate-100 text-slate-700 border-slate-200"
                        }`}
                      >
                        {officer.role}
                      </span>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="text-[11px] font-semibold text-emerald-700">
                        {officer.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-slate-500">
                      {officer.lastLogin}
                    </td>

                    <td className="py-3.5 px-4 sm:px-5 text-right">
                      <select
                        value={officer.role}
                        onChange={(e) =>
                          handleRoleChange(
                            officer.id,
                            e.target.value as "ADMIN" | "MANAGER" | "MANUAL_ORDER_ENTRY"
                          )
                        }
                        className="h-7 px-2 rounded-lg border border-slate-200 text-xs font-medium bg-white focus:outline-none cursor-pointer"
                      >
                        <option value="ADMIN">ADMIN (Full Access)</option>
                        <option value="MANAGER">MANAGER (Ops & CRUD)</option>
                        <option value="MANUAL_ORDER_ENTRY">MANUAL_ORDER_ENTRY (Officer)</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Minimal Matrix */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <Shield className="size-4 text-slate-700" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Role Permission Matrix
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                <tr>
                  <th className="p-2.5">Feature / Route</th>
                  <th className="p-2.5 text-center">ADMIN</th>
                  <th className="p-2.5 text-center">MANAGER</th>
                  <th className="p-2.5 text-center">MANUAL_ORDER_ENTRY</th>
                  <th className="p-2.5">Access Scope</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="p-2.5 font-semibold text-slate-900">/dashboard</td>
                  <td className="p-2.5 text-center text-emerald-600 font-bold">Full</td>
                  <td className="p-2.5 text-center text-emerald-600 font-bold">Full</td>
                  <td className="p-2.5 text-center text-slate-400">Restricted</td>
                  <td className="p-2.5 text-slate-500">Sales analytics, revenue charts, profit & KPI cards.</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-semibold text-slate-900">/orders/new</td>
                  <td className="p-2.5 text-center text-emerald-600 font-bold">Full</td>
                  <td className="p-2.5 text-center text-emerald-600 font-bold">Full</td>
                  <td className="p-2.5 text-center text-emerald-600 font-bold">Full</td>
                  <td className="p-2.5 text-slate-500">Fast phone/inbox customer manual order entry POS.</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-semibold text-slate-900">/orders</td>
                  <td className="p-2.5 text-center text-emerald-600 font-bold">Full</td>
                  <td className="p-2.5 text-center text-emerald-600 font-bold">Full</td>
                  <td className="p-2.5 text-center text-emerald-600 font-bold">Full</td>
                  <td className="p-2.5 text-slate-500">All orders list, status updates & invoice printing.</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-semibold text-slate-900">/customers</td>
                  <td className="p-2.5 text-center text-emerald-600 font-bold">Full</td>
                  <td className="p-2.5 text-center text-emerald-600 font-bold">Full</td>
                  <td className="p-2.5 text-center text-emerald-600 font-bold">Full</td>
                  <td className="p-2.5 text-slate-500">Customer directory, instant phone search & history.</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-semibold text-slate-900">/products</td>
                  <td className="p-2.5 text-center text-emerald-600 font-bold">Full (CRUD)</td>
                  <td className="p-2.5 text-center text-emerald-600 font-bold">Full (CRUD)</td>
                  <td className="p-2.5 text-center text-amber-600 font-bold">Read-only</td>
                  <td className="p-2.5 text-slate-500">Add, edit, delete products with brand & category mapping.</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-semibold text-slate-900">/categories</td>
                  <td className="p-2.5 text-center text-emerald-600 font-bold">Full (CRUD)</td>
                  <td className="p-2.5 text-center text-emerald-600 font-bold">Full (CRUD)</td>
                  <td className="p-2.5 text-center text-amber-600 font-bold">Read-only</td>
                  <td className="p-2.5 text-slate-500">Create, edit, delete and activate/disable categories.</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-semibold text-slate-900">/brands</td>
                  <td className="p-2.5 text-center text-emerald-600 font-bold">Full (CRUD)</td>
                  <td className="p-2.5 text-center text-emerald-600 font-bold">Full (CRUD)</td>
                  <td className="p-2.5 text-center text-amber-600 font-bold">Read-only</td>
                  <td className="p-2.5 text-slate-500">Create, edit, delete and activate/disable brands & vendors.</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-semibold text-slate-900">/inventory & /discounts</td>
                  <td className="p-2.5 text-center text-emerald-600 font-bold">Full</td>
                  <td className="p-2.5 text-center text-emerald-600 font-bold">Full</td>
                  <td className="p-2.5 text-center text-slate-400">Restricted</td>
                  <td className="p-2.5 text-slate-500">Stock adjustments, restock alerts and promo code setup.</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-semibold text-slate-900">/settings/users</td>
                  <td className="p-2.5 text-center text-emerald-600 font-bold">Full</td>
                  <td className="p-2.5 text-center text-slate-400">Restricted</td>
                  <td className="p-2.5 text-center text-slate-400">Restricted</td>
                  <td className="p-2.5 text-slate-500">Create/manage accounts and assign roles (Admin only).</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl space-y-4 animate-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">Add Account</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="size-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
                >
                  <X className="size-3.5" />
                </button>
              </div>

              <form onSubmit={handleAddOfficer} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full h-8.5 px-3 rounded-lg border border-slate-200 focus:border-slate-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="name@pordo.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full h-8.5 px-3 rounded-lg border border-slate-200 focus:border-slate-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone *</label>
                  <input
                    type="tel"
                    required
                    placeholder="01700112233"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full h-8.5 px-3 rounded-lg border border-slate-200 font-mono focus:border-slate-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Assign Role</label>
                  <select
                    value={newRole}
                    onChange={(e) =>
                      setNewRole(e.target.value as "ADMIN" | "MANAGER" | "MANUAL_ORDER_ENTRY")
                    }
                    className="w-full h-8.5 px-2.5 rounded-lg border border-slate-200 bg-white focus:outline-none"
                  >
                    <option value="MANAGER">MANAGER (Operations & Catalog CRUD)</option>
                    <option value="MANUAL_ORDER_ENTRY">MANUAL_ORDER_ENTRY (POS Officer)</option>
                    <option value="ADMIN">ADMIN (Full Super Access)</option>
                  </select>
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-2 rounded-lg border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-800 cursor-pointer"
                  >
                    Create Account
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
