"use client";

import React, { useMemo, useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useRole } from "@/context/role-context";
import {
  Plus,
  Award,
  Lock,
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  brandDelete,
  brandUpdate,
  createBrandData,
  getBrandsData,
} from "@/services/brand.service";
import { DataTable } from "@/shared/table/DataTable";
import { brandColumns, IBrandData } from "./brandColumn";
import AppField from "@/shared/AppFeild";
import {
  brandCreateZodSchema,
  brandUpdateZodSchema,
  BrandCreateFormData,
} from "@/zodValidation/brand.validation";
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
export default function BrandMainComp() {
  
  const { data: brandResponse, isLoading } = useQuery({
    queryKey: ["admin-brands"],
    queryFn: getBrandsData,
    refetchOnWindowFocus: "always",
  });
  const queryClient = useQueryClient();
  const [formError, setFormError] = useState("");
  const [logoPreview, setLogoPreview] = useState("");
  const { mutateAsync: createBrand, isPending: isCreating } = useMutation({
    mutationFn: createBrandData,
  });
  const { mutateAsync: updateBrand, isPending: isUpdating } = useMutation({
    mutationFn: brandUpdate,
  });
  const { mutateAsync: deleteBrand, isPending: isDeleting } = useMutation({
    mutationFn: brandDelete,
  });

  const brandList = Array.isArray(brandResponse?.data)
    ? brandResponse.data
    : [];
  const [deletedBrandIds, setDeletedBrandIds] = useState<Set<string>>(
    new Set(),
  );
  const [brandTableUpdates, setBrandTableUpdates] = useState<
    Record<string, Partial<IBrandData>>
  >({});
  const tableBrands = useMemo<IBrandData[]>(
    () =>
      brandList
        .map((brand) => ({
          ...brand,
          logo: brandTableUpdates[brand.id]?.logo ?? brand.logo ?? "",
          ...brandTableUpdates[brand.id],
        }))
        .filter((brand) => !deletedBrandIds.has(brand.id)),
    [brandList, brandTableUpdates, deletedBrandIds],
  );
  const { hasManagerAccess, role } = useRole();


  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<IBrandData | null>(null);
  const [brandToDelete, setBrandToDelete] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState("");

  // Form State
  const form = useForm({
    defaultValues: {
      name: "",
      logo: null,
    } satisfies BrandCreateFormData,
    onSubmit: async ({ value }) => {
      setFormError("");
      const brandSlug = value.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

      if (editingBrand) {
        const requestData = new FormData();
        requestData.append(
          "data",
          JSON.stringify({
            id: editingBrand.id,
            name: value.name,
            slug: brandSlug,
          }),
        );
        if (value.logo instanceof File) {
          requestData.append("file", value.logo);
        }

        const response = await updateBrand(requestData);
        if (!response.success) {
          setFormError(response.message || "Unable to update brand.");
          return;
        }

        const nextLogo = value.logo instanceof File
          ? URL.createObjectURL(value.logo)
          : editingBrand.logo;

        setBrandTableUpdates((currentUpdates) => ({
          ...currentUpdates,
          [editingBrand.id]: { name: value.name, logo: nextLogo },
        }));
        await queryClient.invalidateQueries({ queryKey: ["admin-brands"] });
      } else {
        if (!(value.logo instanceof File)) return;
        const requestData = new FormData();
        requestData.append(
          "data",
          JSON.stringify({
            name: value.name,
            slug: brandSlug,
          }),
        );
        requestData.append("file", value.logo);

        const response = await createBrand(requestData);
        if (!response.success) {
          setFormError(response.message || "Unable to create brand.");
          return;
        }

        await queryClient.invalidateQueries({ queryKey: ["admin-brands"] });
      }

      setIsModalOpen(false);
    },
  });

  
  const handleOpenAddModal = () => {
    setFormError("");
    setEditingBrand(null);
    form.setFieldValue("name", "");
    form.setFieldValue("logo", null);
    setLogoPreview("");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (brand: IBrandData) => {
    setFormError("");
    setEditingBrand(brand);
    form.setFieldValue("name", brand.name);
    form.setFieldValue("logo", null);
    setLogoPreview(brand.logo);
    setIsModalOpen(true);
  };

  const handleDeleteBrand = (id: string) => {
    setDeleteError("");
    setBrandToDelete(id);
  };

  const confirmDeleteBrand = async () => {
    if (!brandToDelete) return;

    const response = await deleteBrand(brandToDelete);
    if (!response.success) {
      setDeleteError(response.message || "Unable to delete brand.");
      return;
    }

    setDeletedBrandIds((currentIds) => {
      const nextIds = new Set(currentIds);
      nextIds.add(brandToDelete);
      return nextIds;
    });
    await queryClient.invalidateQueries({ queryKey: ["admin-brands"] });
    setBrandToDelete(null);
  };

  return (
    <div>
      <div className="space-y-4 sm:space-y-5 max-w-full overflow-hidden">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              Brands Management
            </h1>
            <p className="text-[11px] sm:text-xs text-slate-500">
              {hasManagerAccess
                ? `Full Brand CRUD access granted (${role})`
                : "Officer Mode: Catalog brands list (Read-only)"}
            </p>
          </div>

          {hasManagerAccess ? (
            <button
              onClick={handleOpenAddModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 shadow-xs transition-all cursor-pointer self-start sm:self-auto"
            >
              <Plus className="size-3.5" />
              <span>Add Brand</span>
            </button>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-semibold self-start sm:self-auto">
              <Lock className="size-3 text-amber-600" />
              <span>Read-Only View</span>
            </div>
          )}
        </div>




          <DataTable
            columns={brandColumns}
            data={tableBrands}
            isLoading={isLoading}
            actions={{
              onEdit: hasManagerAccess
                ? (brand) => {
                    handleOpenEditModal(brand);
                  }
                : undefined,
              onDelete: hasManagerAccess
                ? (brand) => handleDeleteBrand(brand.id)
                : undefined,
            }}
          />



        <Sheet open={isModalOpen} onOpenChange={setIsModalOpen}>
          <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-md">
            <SheetHeader className="border-b border-slate-100">
              <div className="flex items-center gap-2">
                  <Award className="size-4 text-slate-700" />
                <SheetTitle>
                  {editingBrand ? "Edit Brand" : "Add New Brand"}
                </SheetTitle>
              </div>
              <SheetDescription>
                {editingBrand
                  ? "Update the brand details."
                  : "Create a new catalog brand."}
              </SheetDescription>
            </SheetHeader>

              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  void form.handleSubmit();
                }}
                className="space-y-3 px-4 text-xs"
              >
                {formError && (
                  <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[11px] font-medium text-rose-600">
                    {formError}
                  </p>
                )}

                <div>
                  <form.Field
                    name="name"
                    validators={{
                      onChange: brandCreateZodSchema.shape.name,
                      onSubmit: brandCreateZodSchema.shape.name,
                    }}
                  >
                    {(field) => (
                      <AppField
                        field={field}
                        label="Brand Name *"
                        placeholder="e.g. Mens Ethnic Wear"
                      />
                    )}
                  </form.Field>
                </div>

                <form.Field
                  name="logo"
                  validators={{
                    onChange: editingBrand
                      ? brandUpdateZodSchema.shape.logo
                      : brandCreateZodSchema.shape.logo,
                    onSubmit: editingBrand
                      ? brandUpdateZodSchema.shape.logo
                      : brandCreateZodSchema.shape.logo,
                  }}
                >
                  {(field) => (
                    <div>
                      <label className="mb-1 block font-semibold text-slate-700">Brand Logo *</label>
                      <div className="flex gap-2">
                        <div className="min-w-0 flex-1">
                          <input
                            id="logo"
                            name="logo"
                            type="file"
                            accept="image/*"
                            onBlur={field.handleBlur}
                            onChange={(event) => {
                              const file = event.target.files?.[0] ?? null;
                              field.handleChange(file);
                              setLogoPreview(file ? URL.createObjectURL(file) : "");
                            }}
                            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 file:mr-3 file:rounded-lg file:border-0 file:bg-[#123b3a] file:px-2.5 file:py-1.5 file:text-[11px] file:font-semibold file:text-white"
                          />
                        </div>
                        {logoPreview && (
                          <img
                            src={logoPreview}
                            alt="Logo preview"
                            className="size-8.5 shrink-0 rounded-lg border border-slate-200 object-cover"
                          />
                        )}
                      </div>
                    </div>
                  )}
                </form.Field>

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-2 rounded-lg border border-slate-200 text-slate-700 font-semibold cursor-pointer hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating || isUpdating}
                    className="flex-1 py-2 rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-800 cursor-pointer"
                  >
                    {isCreating || isUpdating
                      ? "Uploading..."
                      : editingBrand
                        ? "Update Brand"
                        : "Create Brand"}
                  </button>
                </div>
              </form>
          </SheetContent>
        </Sheet>

        <AlertDialog
          open={brandToDelete !== null}
          onOpenChange={(open) => {
            if (!open) setBrandToDelete(null);
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete brand?</AlertDialogTitle>
              <AlertDialogDescription>
                {deleteError || (
                    "This brand will be removed from the list. Products using this " +
                    "brand will become unassigned."
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                type="button"
                onClick={confirmDeleteBrand}
                disabled={isDeleting}
                className="bg-rose-600 text-white hover:bg-rose-700"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
