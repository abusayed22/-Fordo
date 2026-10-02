"use client";

import React, { useMemo, useState, useCallback, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DataTable } from "@/shared/table/DataTable";
import { ICustomer, CustomerStatus, ICustomerListData } from "@/types/customer.types";
// import {
//   getCustomersData,
//   updateCustomerStatusAction,
// } from "@/services/customer.service";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2, AlertTriangle } from "lucide-react";
// import { CustomerColumns } from "./customerColumns";

const STATUS_TABS: { label: string; value: CustomerStatus | "ALL" }[] = [
  { label: "All Customers", value: "ALL" },
  { label: "Active", value: "ACTIVE" },
  { label: "Inactive", value: "INACTIVE" },
  { label: "Blocked", value: "BLOCKED" },
];

export default function CustomerManagementTable() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const queryClient = useQueryClient();

  // URL States
  const statusParam = searchParams.get("status");
  const status: CustomerStatus | "ALL" =
    statusParam === "ACTIVE" || statusParam === "INACTIVE" || statusParam === "BLOCKED"
      ? statusParam
      : "ALL";

  const search = searchParams.get("search") || searchParams.get("searchTerm") || "";
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const limit = Math.max(1, Number(searchParams.get("limit")) || 10);

  // Confirmation Modal States
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [statusTarget, setStatusTarget] = useState<{
    customer: ICustomer | null;
    nextStatus: CustomerStatus | null;
  }>({
    customer: null,
    nextStatus: null,
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // URL Filter Update
  const updateURLParams = useCallback(
  (updates: { status?: CustomerStatus | "ALL"; search?: string; page?: string }) => {
    const params = new URLSearchParams(searchParams.toString());

    // ১. স্ট্যাটাস আপডেট লজিক (বিদ্যমান স্ট্যাটাস সংরক্ষণ)
    if (updates.status !== undefined) {
      if (updates.status === "ALL") {
        params.delete("status");
      } else {
        params.set("status", updates.status);
      }
      params.set("page", "1");
    }

    // ২. সার্চ আপডেট লজিক (সার্চ করার সময়ও স্ট্যাটাস ধরে রাখবে)
    if (updates.search !== undefined) {
      const trimmedSearch = updates.search.trim();
      if (!trimmedSearch) {
        params.delete("search");
        params.delete("searchTerm");
      } else {
        params.set("searchTerm", trimmedSearch);
      }
      params.set("page", "1");
    }

    // ৩. পেজিনেশন আপডেট
    if (updates.page !== undefined) {
      params.set("page", updates.page);
    }

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  },
  [pathname, router, searchParams]
);

  // TanStack Fetching
  const { data: customerResponse, isLoading } = useQuery({
    queryKey: ["admin-customers", status, search, page, limit],
    queryFn: async () => {
      return await getCustomersData({
        status: status !== "ALL" ? status : undefined,
        searchTerm: search.trim() || undefined,
        page,
        limit,
      });
    },
    staleTime: 30_000,
  });

  // Mutation for updating status
  const { mutateAsync: updateStatus, isPending: isUpdating } = useMutation({
    mutationFn: updateCustomerStatusAction,
    onSuccess: (res) => {
      if (res?.success === false) {
        setErrorMessage(res?.message || "Failed to update status");
        return;
      }
      queryClient.invalidateQueries({ queryKey: ["admin-customers"] });
      setIsConfirmOpen(false);
      setStatusTarget({ customer: null, nextStatus: null });
      setErrorMessage(null);
    },
    onError: (err: unknown) => {
      const errorMsg =
        err instanceof Error ? err.message : "An error occurred while updating status";
      setErrorMessage(errorMsg);
    },
  });

  // Triggers confirmation modal
  const handleStatusChangeRequest = useCallback(
    (customer: ICustomer, targetStatus: CustomerStatus) => {
      if (customer.status === targetStatus) return;
      setErrorMessage(null);
      setStatusTarget({ customer, nextStatus: targetStatus });
      setIsConfirmOpen(true);
    },
    []
  );

  const handleConfirmStatusChange = async () => {
    if (!statusTarget.customer || !statusTarget.nextStatus) return;

    try {
      await updateStatus({
        customerId: statusTarget.customer.id,
        status: statusTarget.nextStatus,
      });
    } catch {
      // Handled in mutation onError
    }
  };

  // Safe Data Normalization
const customers: ICustomer[] = useMemo(() => {
    console.log(customerResponse)
  const list = customerResponse?.data?.data;
  return Array.isArray(list) ? list : [];
}, [customerResponse]);

  // Type-Safe Pagination Meta Matching DataTable TableMeta
  const paginationMeta = useMemo(() => {
  // ব্যাকএন্ড রেসপন্স থেকে মেটা অবজেক্ট বের করা
  const backendMeta = 
    customerResponse?.data?.meta || 
    (customerResponse as any)?.meta;

  // মোট আইটেম সংখ্যা (ব্যাকএন্ড মেটা থেকে, না থাকলে বর্তমান অ্যারে লেন্থ)
  const totalCount = Number(backendMeta?.total ?? customers.length ?? 0);
  
  // ব্যাকএন্ড থেকে totalPage বা totalPages যেটাই আসুক, নিরাপদভাবে নেওয়া
  const calculatedTotalPages = Math.ceil(totalCount / limit) || 1;
  const totalPages = Number(backendMeta?.totalPage ?? backendMeta?.totalPages ?? calculatedTotalPages);

  return {
    page: Number(backendMeta?.page) || page,
    limit: Number(backendMeta?.limit) || limit,
    total: totalCount,
    totalPages: totalPages > 0 ? totalPages : 1,
  };
}, [customerResponse, customers.length, page, limit]);

  const columns = useMemo(
    () => CustomerColumns({ onStatusChangeRequest: handleStatusChangeRequest }),
    [handleStatusChangeRequest]
  );

  return (
    <div className="space-y-4">
      {/* 🎛️ Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto rounded-2xl border border-slate-200/80 bg-white p-2 shadow-xs select-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => updateURLParams({ status: tab.value })}
            className={`cursor-pointer rounded-lg px-3.5 py-1.5 text-xs font-semibold shrink-0 transition-all ${
              status === tab.value
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 📊 Shared DataTable */}
      <DataTable
        data={customers}
        columns={columns}
        isLoading={isLoading}
        // meta={paginationMeta}
        searchPlaceholder="Search customer by name, phone or email..."
        emptyMessage="No customers found."
        // pageSize={limit}
      />

      {/* 🔒 Status Change Confirmation Dialog */}
      <AlertDialog
        open={isConfirmOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsConfirmOpen(false);
            setStatusTarget({ customer: null, nextStatus: null });
            setErrorMessage(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-2 text-amber-600">
              <AlertTriangle className="size-5" />
              <AlertDialogTitle>Change Customer Status?</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-xs text-slate-600 pt-2 leading-relaxed">
              Are you sure you want to change the status of{" "}
              <strong className="text-slate-900">
                "{statusTarget.customer?.name || "Customer"}"
              </strong>{" "}
              from{" "}
              <span className="font-semibold text-slate-800">
                {statusTarget.customer?.status}
              </span>{" "}
              to{" "}
              <span className="font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                {statusTarget.nextStatus}
              </span>
              ?
              {statusTarget.nextStatus === "BLOCKED" && (
                <span className="block mt-2 font-medium text-rose-600">
                  ⚠️ Warning: Blocked customers will not be allowed to place new orders.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>

          {errorMessage && (
            <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-medium animate-in fade-in duration-200">
              {errorMessage}
            </div>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isUpdating}
              className="text-xs cursor-pointer"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleConfirmStatusChange();
              }}
              disabled={isUpdating}
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" /> Updating...
                </>
              ) : (
                "Yes, Confirm Update"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}