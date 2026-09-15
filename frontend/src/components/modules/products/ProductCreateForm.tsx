"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  ChevronDown,
  Upload,
  Sparkles,
  Loader2,
  AlertCircle,
  CheckCircle2,
  X,
  DollarSign,
  Layers,
  FileText,
  Truck,
  Building2,
  Receipt,
  Percent,
} from "lucide-react";
import { getBrandsData } from "@/services/brand.service";
import { getCategoriesData } from "@/services/categories.service";
import AppField from "@/shared/AppFeild";
import { DiscountType, ProductUnit } from "@/types/product.typs";
import {
  ProductCreateFormData,
  productCreateZodSchema,
} from "@/zodValidation/product.validation";
import { createProductAction } from "@/services/product.service";

interface RelationshipOption {
  id: string;
  name: string;
  image?: string;
}

interface RelationshipPickerProps {
  label: string;
  value: string;
  options: RelationshipOption[];
  placeholder: string;
  loading: boolean;
  error?: boolean;
  required?: boolean;
  onChange: (value: string) => void;
}

function RelationshipPicker({
  label,
  value,
  options,
  placeholder,
  loading,
  error = false,
  required = false,
  onChange,
}: RelationshipPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((option) => option.id === value);

  return (
    <div className="relative space-y-1.5">
      <label className="block font-bold text-slate-700 text-xs">
        {label} {required ? "*" : ""}
      </label>
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        className="flex h-11 w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 text-left text-xs font-medium text-slate-900 outline-none transition-colors hover:bg-white focus:border-[#056D6E]"
      >
        <span className="flex min-w-0 items-center gap-2">
          {selectedOption ? (
            <>
              {selectedOption.image ? (
                <img
                  src={selectedOption.image}
                  alt=""
                  className="size-7 shrink-0 rounded-lg object-cover"
                />
              ) : (
                <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-[#e7b85c] text-[10px] font-bold text-[#123b3a]">
                  {selectedOption.name.charAt(0).toUpperCase()}
                </span>
              )}
              <span className="truncate">{selectedOption.name}</span>
            </>
          ) : (
            <span className="text-slate-400">
              {loading ? `Loading ${label.toLowerCase()}...` : placeholder}
            </span>
          )}
        </span>
        <ChevronDown className="size-4 shrink-0 text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute inset-x-0 top-full z-20 mt-1 max-h-60 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">
          {!required && (
            <button
              type="button"
              onClick={() => {
                onChange("");
                setIsOpen(false);
              }}
              className="w-full rounded-lg px-2.5 py-2 text-left text-xs text-slate-500 hover:bg-slate-50"
            >
              {placeholder}
            </button>
          )}
          {options.length === 0 ? (
            <p className="px-2.5 py-2 text-xs text-slate-400">
              {loading
                ? `Loading ${label.toLowerCase()}...`
                : error
                  ? `Unable to load ${label.toLowerCase()}`
                  : `No ${label.toLowerCase()} available`}
            </p>
          ) : (
            options.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => {
                  onChange(option.id);
                  setIsOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-medium text-slate-800 hover:bg-slate-50"
              >
                {option.image ? (
                  <img src={option.image} alt="" className="size-8 rounded-lg object-cover" />
                ) : (
                  <span className="flex size-8 items-center justify-center rounded-lg bg-[#e7b85c] text-[10px] font-bold text-[#123b3a]">
                    {option.name.charAt(0).toUpperCase()}
                  </span>
                )}
                <span className="truncate">{option.name}</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

interface ProductCreateFormProps {
  baseReturnPath?: string;
}


export const PRODUCT_UNITS: { label: string; value: ProductUnit }[] = [
  { label: "Piece (Pcs)", value: "PIECE" },
  { label: "Kilogram (Kg)", value: "KG" },
  { label: "Gram (Gm)", value: "GM" },
  { label: "Milligram (Mg)", value: "MG" },
  { label: "Liter (L)", value: "LITER" },
  { label: "Milliliter (Ml)", value: "ML" },
  { label: "Packet (Pkt)", value: "PACKET" },
  { label: "Box", value: "BOX" },
  { label: "Dozen (Dzn)", value: "DOZEN" },
  { label: "Pair", value: "PAIR" },
  { label: "Bundle", value: "BUNDLE" },
  { label: "Bag", value: "BAG" },
  { label: "Bottle", value: "BOTTLE" },
  { label: "Can", value: "CAN" },
];

export function ProductCreateForm({
  baseReturnPath = "/admin/products",
}: ProductCreateFormProps) {
  const queryClient = useQueryClient();

  const { data: categoriesResponse, isLoading: areCategoriesLoading } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: getCategoriesData,
    staleTime: 30_000,
  });
  const {
    data: brandsResponse,
    isLoading: areBrandsLoading,
    isError: hasBrandsError,
  } = useQuery({
    queryKey: ["admin-brands"],
    queryFn: getBrandsData,
    staleTime: 30_000,
    refetchOnWindowFocus: "always",
  });

  const categories = Array.isArray(categoriesResponse?.data)
    ? categoriesResponse.data.filter((category) => !category.isDeleted)
    : [];
  const brands = Array.isArray(brandsResponse?.data) ? brandsResponse.data : [];
  const brandsLoadFailed = hasBrandsError || brandsResponse?.success === false;

  const [imagePreview, setImagePreview] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // TanStack Mutation
  const { mutateAsync: createProduct, isPending: isCreating } = useMutation({
    mutationFn: createProductAction,
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ["products"] });
        queryClient.invalidateQueries({ queryKey: ["inventory"] });
        setIsSuccessModalOpen(true);
      }
    },
    onError: (error: any) => {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to create product";
      setErrorMessage(msg);
    },
  });

  // TanStack Form (ক্যাটাগরি কম্পোনেন্টের মতো useForm হ্যান্ডলিং)
  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      categoryId: "",
      brandId: "",
      costPrice: 0,
      originalPrice: 0,
      sellingPrice: 0,
      stock: 10,
      unitType: "PIECE" as ProductUnit,
      unitValue: 1,
      isDiscounted: false,
      discountType: "PERCENTAGE" as DiscountType,
      discountValue: 0,
      discountExpires: "",
      supplierName: "",
      invoiceNo: "",
      file: null as File | null,
    } as ProductCreateFormData & { file: File | null },
    onSubmit: async ({ value }) => {
      setErrorMessage("");

      const parsedValue = productCreateZodSchema.safeParse(value);
      if (!parsedValue.success) {
        setErrorMessage(parsedValue.error.issues[0]?.message || "Please check the form fields.");
        return;
      }

      const validValue = parsedValue.data;

      // FormData প্যাটার্ন হুবহু ক্যাটাগরি কম্পোনেন্টের মতো
      const formData = new FormData();

      formData.append(
  "data",
  JSON.stringify({
    title: validValue.title,
    description: validValue.description || undefined,
    categoryId: validValue.categoryId,
    brandId: validValue.brandId || undefined,
    costPrice: Number(validValue.costPrice),
    originalPrice: Number(validValue.originalPrice),
    sellingPrice: Number(validValue.sellingPrice),
    stock: Number(validValue.stock),
    unitType: validValue.unitType, // ব্যাকএন্ড unitType ফিল্ড আশা করছে
    unitValue: validValue.unitValue ? Number(validValue.unitValue) : undefined,
    isDiscounted: validValue.isDiscounted,
    discountType: validValue.isDiscounted ? validValue.discountType : undefined,
    discountValue: validValue.isDiscounted ? Number(validValue.discountValue) : undefined,
    discountExpires:
      validValue.isDiscounted && validValue.discountExpires
        ? new Date(validValue.discountExpires).toISOString()
        : undefined,
    supplierName: validValue.supplierName || undefined,
    invoiceNo: validValue.invoiceNo || undefined,
  })
);

      formData.append("file", validValue.file);

      const response = await createProduct(formData);
      if (!response.success) {
        setErrorMessage(response.message || "Failed to create product.");
      }
    },
  });

  // ── Discount & Selling Price Calculation Helper ──
  const updateSellingPrice = (
    originalPrice: number,
    isDiscounted: boolean,
    discountType: DiscountType,
    discountValue: number
  ) => {
    if (!isDiscounted) {
      form.setFieldValue("sellingPrice", originalPrice);
      return;
    }

    let calculated = originalPrice;
    if (discountType === "PERCENTAGE") {
      calculated = originalPrice - (originalPrice * (discountValue || 0)) / 100;
    } else {
      calculated = originalPrice - (discountValue || 0);
    }

    form.setFieldValue("sellingPrice", Math.max(0, Math.round(calculated)));
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href={baseReturnPath}
            className="size-9 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-50"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Add New Product</h1>
            <p className="text-xs text-slate-500">Multipart: data + file payload</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => form.handleSubmit()}
          disabled={isCreating}
          className="px-4 py-2 rounded-xl bg-[#056D6E] text-white text-xs font-bold hover:bg-[#045657] disabled:opacity-50 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          {isCreating ? (
            <>
              <Loader2 className="size-3.5 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Sparkles className="size-3.5" />
              <span>Create Product</span>
            </>
          )}
        </button>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="size-4 text-rose-500 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Form Content */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void form.handleSubmit();
        }}
        className="grid grid-cols-1 lg:grid-cols-12 gap-6"
      >
        {/* Left Side: Fields */}
        <div className="lg:col-span-8 space-y-5">
          {/* Section 1: Title & Description */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <FileText className="size-4 text-[#056D6E]" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                General Information
              </h2>
            </div>

            <form.Field
              name="title"
              children={(field) => (
                <AppField
                  field={field}
                  label="Product Title *"
                  placeholder="e.g. Pure Cotton Formal Shirt"
                />
              )}
            />

            <form.Field
              name="description"
              children={(field) => (
                <div className="space-y-1.5">
                  <label className="block font-bold text-slate-700 text-xs">
                    Description
                  </label>
                  <textarea
                    id={field.name}
                    name={field.name}
                    rows={3}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Product specification..."
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs placeholder-slate-400 focus:bg-white focus:border-[#056D6E] focus:outline-none transition-all font-medium"
                  />
                </div>
              )}
            />
          </div>

          {/* Section 2: Pricing Details */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <DollarSign className="size-4 text-[#056D6E]" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Pricing Details
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <form.Field
                name="costPrice"
                children={(field) => (
                  <AppField
                    field={field}
                    label="Cost Price *"
                    type="number"
                    prepend={<span className="text-xs font-bold text-slate-400">৳</span>}
                  />
                )}
              />

              <form.Field name="originalPrice">
                {(field) => (
                  <div className="space-y-1.5">
                    <AppField
                      field={
                        {
                          ...field,
                          handleChange: (val: any) => {
                            const num = Number(val);
                            field.handleChange(num);
                            updateSellingPrice(
                              num,
                              form.getFieldValue("isDiscounted"),
                              form.getFieldValue("discountType"),
                              form.getFieldValue("discountValue")
                            );
                          },
                        } as typeof field
                      }
                      label="Original Price *"
                      type="number"
                      prepend={<span className="text-xs font-bold text-slate-400">৳</span>}
                    />
                  </div>
                )}
              </form.Field>

              <form.Field
                name="sellingPrice"
                children={(field) => (
                  <AppField
                    field={field}
                    label="Selling Price *"
                    type="number"
                    prepend={<span className="text-xs font-bold text-slate-400">৳</span>}
                  />
                )}
              />
            </div>
          </div>

          {/* Section 3: Discounts */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Percent className="size-4 text-[#056D6E]" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Discounts
                </h2>
              </div>

              <form.Field
                name="isDiscounted"
                children={(field) => (
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-xs font-semibold text-slate-700">Apply Discount</span>
                    <input
                      type="checkbox"
                      checked={field.state.value}
                      onChange={(e) => field.handleChange(e.target.checked)}
                      className="size-4 accent-[#056D6E] cursor-pointer"
                    />
                  </label>
                )}
              />
            </div>

            <form.Subscribe
              selector={(state) => [state.values.isDiscounted]}
              children={([isDiscounted]) =>
                isDiscounted ? (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <form.Field
                      name="discountType"
                      children={(field) => (
                        <div className="space-y-1.5">
                          <label className="block font-bold text-slate-700 text-xs">
                            Discount Type
                          </label>
                          <select
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value as DiscountType)}
                            className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:bg-white focus:border-[#056D6E] outline-none cursor-pointer"
                          >
                            <option value="PERCENTAGE">PERCENTAGE (%)</option>
                            <option value="FIXED_AMOUNT">FLAT (৳)</option>
                          </select>
                        </div>
                      )}
                    />

                    <form.Field
                      name="discountValue"
                      children={(field) => (
                        <AppField
                          field={field}
                          label="Discount Value"
                          type="number"
                        />
                      )}
                    />

                    <form.Field
                      name="discountExpires"
                      children={(field) => (
                        <div className="space-y-1.5">
                          <label className="block font-bold text-slate-700 text-xs">
                            Expires At
                          </label>
                          <input
                            type="datetime-local"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:bg-white focus:border-[#056D6E] outline-none"
                          />
                        </div>
                      )}
                    />
                  </div>
                ) : null
              }
            />
          </div>

          {/* Section 4: Stock & Measurements */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Layers className="size-4 text-[#056D6E]" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Stock & Measurements
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <form.Field
                name="stock"
                children={(field) => (
                  <AppField
                    field={field}
                    label="Stock Quantity *"
                    type="number"
                  />
                )}
              />

              <form.Field
                name="unitType"
                children={(field) => (
                  <div className="space-y-1.5">
                    <label className="block font-bold text-slate-700 text-xs">
                      Unit *
                    </label>
                    <select
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value as ProductUnit)}
                      className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:bg-white focus:border-[#056D6E] outline-none cursor-pointer transition-colors"
                    >
                      {PRODUCT_UNITS.map((unit) => (
                        <option key={unit.value} value={unit.value}>
                          {unit.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              />

              <form.Field
                name="unitValue"
                children={(field) => (
                  <AppField
                    field={field}
                    label="Unit Value"
                    type="number"
                  />
                )}
              />
            </div>
          </div>

          {/* Section 5: Sourcing & Supplier */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Truck className="size-4 text-[#056D6E]" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Sourcing & Supplier
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <form.Field
                name="supplierName"
                children={(field) => (
                  <AppField
                    field={field}
                    label="Supplier Name"
                    placeholder="e.g. Sourcing Factory"
                    prepend={<Building2 className="size-4 text-slate-400" />}
                  />
                )}
              />

              <form.Field
                name="invoiceNo"
                children={(field) => (
                  <AppField
                    field={field}
                    label="Invoice No"
                    placeholder="e.g. INV-2026-001"
                    prepend={<Receipt className="size-4 text-slate-400" />}
                  />
                )}
              />
            </div>
          </div>
        </div>

        {/* Right Side: File Upload & Relationships */}
        <div className="lg:col-span-4 space-y-5">
          {/* File Upload (MultiPart 'file') handled via form.Field */}
          <form.Field
            name="file"
            children={(field) => (
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Product Image (File) *
                </h2>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const selected = e.target.files?.[0] ?? null;
                    if (selected && !selected.type.startsWith("image/")) {
                      setErrorMessage("Only image files are allowed!");
                      return;
                    }
                    field.handleChange(selected);
                    setImagePreview(selected ? URL.createObjectURL(selected) : "");
                    setErrorMessage("");
                  }}
                  className="hidden"
                />

                {!imagePreview ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-200 hover:border-[#056D6E] rounded-xl p-6 text-center cursor-pointer transition-colors bg-slate-50/50"
                  >
                    <Upload className="size-6 text-[#056D6E] mx-auto mb-2" />
                    <p className="text-xs font-bold text-slate-800">Select Image File</p>
                    <p className="text-[10px] text-slate-400 mt-1">MultiPart: key = "file"</p>
                  </div>
                ) : (
                  <div className="relative rounded-xl overflow-hidden border border-slate-200 aspect-square group">
                    <img src={imagePreview} alt="Preview" className="size-full object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        field.handleChange(null);
                        setImagePreview("");
                      }}
                      className="absolute top-2 right-2 size-7 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-md cursor-pointer hover:bg-rose-700"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                )}
              </div>
            )}
          />

          {/* Relations: Category & Brand */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Relations
            </h2>

            <form.Field
              name="categoryId"
              children={(field) => (
                <RelationshipPicker
                  label="Category"
                  value={field.state.value}
                  options={categories.map((category) => ({
                    id: category.id,
                    name: category.name,
                    image: category.logo,
                  }))}
                  placeholder="Select a category"
                  loading={areCategoriesLoading}
                  required
                  onChange={field.handleChange}
                />
              )}
            />

            <form.Field
              name="brandId"
              children={(field) => (
                <RelationshipPicker
                  label="Brand"
                  value={field.state.value}
                  options={brands.map((brand) => ({
                    id: brand.id,
                    name: brand.name,
                    image: brand.logo,
                  }))}
                  placeholder="Select a brand"
                  loading={areBrandsLoading}
                  error={brandsLoadFailed}
                  required
                  onChange={field.handleChange}
                />
              )}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isCreating}
            className="w-full py-3 rounded-xl bg-[#056D6E] text-white text-xs font-bold hover:bg-[#045657] disabled:opacity-50 transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
          >
            {isCreating ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Sending Multipart Data...</span>
              </>
            ) : (
              <>
                <Sparkles className="size-4" />
                <span>Submit Product</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Success Modal */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 text-center">
            <div className="size-14 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center border border-emerald-200">
              <CheckCircle2 className="size-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Success!</h3>
            <p className="text-xs text-slate-500">
              Product data and file uploaded successfully to server.
            </p>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsSuccessModalOpen(false);
                  form.reset();
                  setImagePreview("");
                }}
                className="py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700"
              >
                Add Another
              </button>
              <Link
                href={baseReturnPath}
                className="py-2 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center justify-center"
              >
                Go to Catalog
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}