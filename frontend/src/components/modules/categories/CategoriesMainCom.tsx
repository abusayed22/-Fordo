"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { useForm } from "@tanstack/react-form";
import { Plus, FolderTree, Lock, Loader2 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  categoryDelete as categoryDeleteAction,
  categoryUpdate,
  createCategoryData,
  getCategoriesData,
} from "@/services/categories.service";
import { DataTable } from "@/shared/table/DataTable";
import { categoryColumns, ICategoryData } from "./categoryCoumn";
import AppField from "@/shared/AppFeild";
import {
  categoryCreateZodSchema,
  categoryUpdateZodSchema,
  type CategoryCreateFormData,
} from "@/zodValidation/category.validation";
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

export default function CategoriesMainCom() {
  const queryClient = useQueryClient();
  const [formError, setFormError] = useState("");
  const [logoPreview, setLogoPreview] = useState("");

  const { data: categoryResponse, isLoading } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: getCategoriesData,
    refetchOnWindowFocus: "always",
  });

  const { mutateAsync: createCategory, isPending: isCreating } = useMutation({
    mutationFn: createCategoryData,
  });
  const { mutateAsync: updateCategory, isPending: isUpdating } = useMutation({
    mutationFn: categoryUpdate,
  });
  const { mutateAsync: deleteCategory, isPending: isDeleting } = useMutation({
    mutationFn: categoryDeleteAction,
  });

  const categoriesList: ICategoryData[] = Array.isArray(categoryResponse?.data)
    ? (categoryResponse.data as unknown as ICategoryData[])
    : [];

  const [deletedCategoryIds, setDeletedCategoryIds] = useState<Set<string>>(
    new Set()
  );
  const [categoryTableUpdates, setCategoryTableUpdates] = useState<
    Record<string, Partial<ICategoryData>>
  >({});

  const tableCategories = useMemo<ICategoryData[]>(() => {
    return categoriesList
      .map((category) => ({
        ...category,
        name: categoryTableUpdates[category.id]?.name ?? category.name,
        logo: categoryTableUpdates[category.id]?.logo ?? category.logo ?? "",
        isDeleted:
          categoryTableUpdates[category.id]?.isDeleted ??
          category.isDeleted ??
          false,
        createdAt: category.createdAt ?? "",
        updatedAt: category.updatedAt ?? "",
      }))
      .filter((category) => !deletedCategoryIds.has(category.id));
  }, [categoriesList, categoryTableUpdates, deletedCategoryIds]);

  const hasManagerAccess = true;
  const role = "ADMIN";

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ICategoryData | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState("");

  // Form State
  const form = useForm({
    defaultValues: {
      name: "",
      logo: null as unknown as File | null,
    } as CategoryCreateFormData,
    onSubmit: async ({ value }) => {
      setFormError("");
      const categorySlug = value.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

      if (editingCategory) {
        const requestData = new FormData();
        requestData.append(
          "data",
          JSON.stringify({
            id: editingCategory.id,
            name: value.name,
            slug: categorySlug,
          })
        );
        if (value.logo instanceof File) {
          requestData.append("file", value.logo);
        }

        const response = await updateCategory(requestData);
        if (!response.success) {
          setFormError(response.message || "Unable to update category.");
          return;
        }

        const nextImage =
          value.logo instanceof File
            ? URL.createObjectURL(value.logo)
            : editingCategory.logo;

        setCategoryTableUpdates((currentUpdates) => ({
          ...currentUpdates,
          [editingCategory.id]: { name: value.name, logo: nextImage },
        }));
        await queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      } else {
        if (!(value.logo instanceof File)) {
          setFormError("Please select a category image.");
          return;
        }

        const requestData = new FormData();
        requestData.append(
          "data",
          JSON.stringify({
            name: value.name,
            slug: categorySlug,
          })
        );
        requestData.append("file", value.logo);

        const response = await createCategory(requestData);
        if (!response.success) {
          setFormError(response.message || "Unable to create category.");
          return;
        }

        await queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      }

      setIsModalOpen(false);
    },
  });

  const handleOpenAddModal = () => {
    setFormError("");
    setEditingCategory(null);
    form.setFieldValue("name", "");
    form.setFieldValue("logo");
    setLogoPreview("");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cat: ICategoryData) => {
    setFormError("");
    setEditingCategory(cat);
    form.setFieldValue("name", cat.name);
    form.setFieldValue("logo");
    setLogoPreview(cat.logo || "");
    setIsModalOpen(true);
  };

  const handleDeleteCategory = (id: string) => {
    setDeleteError("");
    setCategoryToDelete(id);
  };

  const confirmDeleteCategory = async () => {
    if (!categoryToDelete) return;

    const response = await deleteCategory(categoryToDelete);
    if (!response.success) {
      setDeleteError(response.message || "Unable to delete category.");
      return;
    }

    setDeletedCategoryIds((currentIds) => {
      const nextIds = new Set(currentIds);
      nextIds.add(categoryToDelete);
      return nextIds;
    });
    await queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
    setCategoryToDelete(null);
  };

  return (
    <div>
      <div className="space-y-4 sm:space-y-5 max-w-full overflow-hidden">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              Categories Management
            </h1>
            <p className="text-[11px] sm:text-xs text-slate-500">
              {hasManagerAccess
                ? `Full Category CRUD access granted (${role})`
                : "Officer Mode: Catalog categories list (Read-only)"}
            </p>
          </div>

          {hasManagerAccess ? (
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 shadow-xs transition-all cursor-pointer self-start sm:self-auto"
            >
              <Plus className="size-3.5" />
              <span>Add Category</span>
            </button>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-semibold self-start sm:self-auto">
              <Lock className="size-3 text-amber-600" />
              <span>Read-Only View</span>
            </div>
          )}
        </div>

        <DataTable
          columns={categoryColumns}
          data={tableCategories}
          isLoading={isLoading}
          actions={{
            onEdit: hasManagerAccess
              ? (category) => handleOpenEditModal(category)
              : undefined,
            onDelete: hasManagerAccess
              ? (category) => handleDeleteCategory(category.id)
              : undefined,
          }}
        />

        <Sheet open={isModalOpen} onOpenChange={setIsModalOpen}>
          <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-md">
            <SheetHeader className="border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FolderTree className="size-4 text-slate-700" />
                <SheetTitle>
                  {editingCategory ? "Edit Category" : "Add New Category"}
                </SheetTitle>
              </div>
              <SheetDescription>
                {editingCategory
                  ? "Update the category details."
                  : "Create a new catalog category."}
              </SheetDescription>
            </SheetHeader>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                event.stopPropagation();
                void form.handleSubmit();
              }}
              className="space-y-4 px-1 py-4 text-xs"
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
                    onChange: ({ value }) => {
                      const res = categoryCreateZodSchema.shape.name.safeParse(value);
                      return res.success ? undefined : res.error.issues[0]?.message;
                    },
                  }}
                >
                  {(field) => (
                    <AppField
                      field={field}
                      label="Category Name *"
                      placeholder="e.g. Mens Ethnic Wear"
                    />
                  )}
                </form.Field>
              </div>

              <div>
                <form.Field
                  name="logo"
                  validators={{
                    onChange: ({ value }) => {
                      const schema = editingCategory
                        ? categoryUpdateZodSchema.shape.logo
                        : categoryCreateZodSchema.shape.logo;
                      const res = schema.safeParse(value);
                      return res.success ? undefined : res.error.issues[0]?.message;
                    },
                  }}
                >
                  {(field) => (
                    <div>
                      <label className="mb-1 block font-semibold text-slate-700">
                        Category Image {!editingCategory && "*"}
                      </label>
                      <div className="flex items-center gap-3">
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
                          <div className="relative size-10 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                            <Image
                              src={logoPreview}
                              alt="Logo preview"
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </form.Field>
              </div>

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
                  className="flex items-center justify-center gap-1.5 flex-1 py-2 rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-800 disabled:opacity-50 cursor-pointer"
                >
                  {(isCreating || isUpdating) && (
                    <Loader2 className="size-3.5 animate-spin" />
                  )}
                  <span>
                    {isCreating || isUpdating
                      ? "Uploading..."
                      : editingCategory
                      ? "Update Category"
                      : "Create Category"}
                  </span>
                </button>
              </div>
            </form>
          </SheetContent>
        </Sheet>

        <AlertDialog
          open={categoryToDelete !== null}
          onOpenChange={(open) => {
            if (!open) setCategoryToDelete(null);
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete category?</AlertDialogTitle>
              <AlertDialogDescription>
                {deleteError ||
                  "This category will be removed from the list. Products in this category will become unassigned."}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                type="button"
                onClick={confirmDeleteCategory}
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