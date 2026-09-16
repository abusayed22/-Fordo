"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Minus, Package, Plus, Search, Trash2, UserRound, AlertCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { IProductResponse } from "@/types/product.typs";
import { createOrderAction } from "@/services/order.service";
import { type CreateOrderPayload } from "@/zodValidation/order.validation";
import { getProductsData } from "@/services/product.service";

type CartItem = CreateOrderPayload["items"][number] & {
    stock: number;
    productName?: string;
    sku?: string;
    image?: string;
    brand?: string;
    category?: string;
    unitType?: string;
    originalPrice?: number;
    discountAmount?: number;
    discountPercent?: number;
    discountType?: string;
};

type ProductOption = IProductResponse;

const STORAGE_KEY = "pos_draft_order_v1";

export default function CreateOrder({ initialProducts }: Readonly<{ initialProducts: ProductOption[] }>) {
    const queryClient = useQueryClient();
    const [productSearch, setProductSearch] = useState("");
    const [serverError, setServerError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState("");
    const [stockWarning, setStockWarning] = useState<string | null>(null);

    // ১. প্রোডাক্ট ফেচিং কুয়েরি
    const { data: products = [], isLoading: productsLoading } = useQuery({
        queryKey: ["manual-order-products"],
        queryFn: async () => {
            const response = await getProductsData({ limit: 100 });
            if (Array.isArray(response?.data)) {
                return response.data as ProductOption[];
            }
            if (Array.isArray((response?.data as any)?.products)) {
                return (response.data as any).products as ProductOption[];
            }
            return [];
        },
        initialData: initialProducts,
        staleTime: 60_000,
    });

    // ২. TanStack Form ইনিশিয়ালাইজেশন
    const form = useForm({
        defaultValues: {
            customerName: "",
            customerPhone: "",
            shippingAddress: "",
            deliveryFee: 80,
            deliveryZone: "Inside Dhaka" as "Inside Dhaka" | "Outside Dhaka",
            paymentMethod: "COD" as CreateOrderPayload["paymentMethod"],
            note: "",
            items: [] as CartItem[],
        },
        onSubmit: async ({ value }) => {
            setServerError(null);
            setSuccessMessage("");
            setStockWarning(null);

            if (!value.items || value.items.length === 0) {
                setServerError("Please add at least one product to the order.");
                return;
            }

            // সাবমিটের পূর্বে লেটেস্ট ইনভেন্টরি দিয়ে চূড়ান্ত স্টক চেক
            for (const item of value.items) {
                const liveProduct = products.find((p) => (p.id || p.title) === item.productId);
                if (!liveProduct || liveProduct.stock < 1) {
                    setServerError(`"${item.productName || 'Product'}" is currently out of stock. Please remove it.`);
                    return;
                }
                if (liveProduct.stock < item.quantity) {
                    setServerError(`Only ${liveProduct.stock} units available for "${item.productName}". Please reduce quantity.`);
                    return;
                }
            }

            const payload = {
                addressId: "manual-counter-pos-id",
                customerName: value.customerName,
                customerPhone: value.customerPhone,
                shippingAddress: value.shippingAddress,
                deliveryZone: value.deliveryZone,
                paymentMethod: value.paymentMethod,
                note: value.note || undefined,
                items: value.items.map((item) => ({
                    productId: item.productId,
                    productName: item.productName,
                    sku: item.sku || item.productId,
                    quantity: Number(item.quantity),
                    unitPrice: Number(item.unitPrice),
                })),
            };

            createOrderMutation.mutate(payload as any);
        },
    });

    // ৩. পেজ রিলোডে লোকাল স্টোরেজ থেকে ডেটা লোড করা
    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (!saved) return;
            const parsed = JSON.parse(saved);

            if (parsed.customerName) form.setFieldValue("customerName", parsed.customerName);
            if (parsed.customerPhone) form.setFieldValue("customerPhone", parsed.customerPhone);
            if (parsed.shippingAddress) form.setFieldValue("shippingAddress", parsed.shippingAddress);
            if (parsed.note) form.setFieldValue("note", parsed.note);
            if (Array.isArray(parsed.items) && parsed.items.length > 0) {
                form.setFieldValue("items", parsed.items);
            }
        } catch (e) {
            console.error("Failed to restore draft order from localStorage", e);
        }
    }, []);

    // ৪. লাইভ স্টক ভ্যালিডেশন এবং অটো অ্যাডজাস্টমেন্ট
    useEffect(() => {
        if (!products.length) return;

        const currentItems = form.getFieldValue("items") || [];
        if (!currentItems.length) return;

        let modified = false;
        const adjustedItems: CartItem[] = [];
        const warnings: string[] = [];

        for (const item of currentItems) {
            const liveProduct = products.find((p) => (p.id || p.title) === item.productId);

            if (!liveProduct || liveProduct.stock <= 0) {
                modified = true;
                warnings.push(`"${item.productName}" is completely out of stock and was removed.`);
                continue; // কার্ট থেকে বাদ
            }

            if (liveProduct.stock < item.quantity) {
                modified = true;
                warnings.push(`"${item.productName}" stock reduced to ${liveProduct.stock}.`);
                adjustedItems.push({
                    ...item,
                    quantity: liveProduct.stock,
                    stock: liveProduct.stock,
                });
            } else {
                adjustedItems.push({
                    ...item,
                    stock: liveProduct.stock,
                });
            }
        }

        if (modified) {
            form.setFieldValue("items", adjustedItems);
            setStockWarning(warnings.join(" | "));
            saveDraftToStorage(adjustedItems);
        }
    }, [products]);

    // ড্রাফট স্টোরেজ সেভ হেল্পার
    const saveDraftToStorage = (updatedItems?: CartItem[]) => {
        try {
            const draft = {
                customerName: form.getFieldValue("customerName"),
                customerPhone: form.getFieldValue("customerPhone"),
                shippingAddress: form.getFieldValue("shippingAddress"),
                note: form.getFieldValue("note"),
                items: updatedItems ?? form.getFieldValue("items"),
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
        } catch (e) {
            console.error("Storage write error", e);
        }
    };

    // ৫. অর্ডার তৈরি মিউটেশন
    const createOrderMutation = useMutation({
        mutationFn: createOrderAction,
        onSuccess: async (response: any) => {
            const isSuccess = response?.success ?? response?.data?.success ?? true;
            const msg = response?.message || response?.data?.message || "Order created successfully.";

            if (!isSuccess) {
                setServerError(msg || "Failed to place order.");
                setSuccessMessage("");
                return;
            }

            setServerError(null);
            setSuccessMessage(msg);
            setStockWarning(null);

            // অর্ডার সফল হলে ফর্ম রিসেট ও লোকাল স্টোরেজ ডিলিট
            form.reset();
            form.setFieldValue("items", []);
            localStorage.removeItem(STORAGE_KEY);

            await queryClient.invalidateQueries({ queryKey: ["manual-orders"],exact: false });
            await queryClient.invalidateQueries({ queryKey: ["manual-order-products"] });
        },
        onError: (error: Error) => {
            setSuccessMessage("");
            setServerError(error.message || "Something went wrong while creating the order.");
        },
    });

    // হেল্পার মেথডসমূহ
    const getProductId = (product: ProductOption) => product.id || product.title;
    const getProductSku = (product: ProductOption) => product.sku || product.title;
    const getProductImage = (product: ProductOption) => {
        const image = product.images?.[0];
        return typeof image === "string" ? image : image?.url || "/placeholder-product.jpg";
    };
    const getProductBrand = (product: ProductOption) =>
        product.brandName || (typeof product.brand === "object" ? product.brand?.name : "Brand not specified");
    const getProductCategory = (product: ProductOption) =>
        product.categoryName || (typeof product.category === "object" ? product.category?.name : "Category not specified");

    const getProductUnitPrice = (product: ProductOption) => {
        if (product.isDiscounted && (product.discountType === "FIXED_AMOUNT" || (product.discountType as any) === "FIXED")) {
            return Math.max(0, product.sellingPrice - (product.discountValue || 0));
        }
        return product.sellingPrice;
    };

    const getDiscountAmount = (product: ProductOption) => {
        const isFlat = product.discountType === "FIXED_AMOUNT" || (product.discountType as any) === "FIXED";
        return isFlat
            ? Math.max(0, product.discountValue || 0)
            : Math.max(0, product.originalPrice - product.sellingPrice);
    };

    const filteredProducts = products.filter((product) => {
        const search = productSearch.toLowerCase();
        return product.title.toLowerCase().includes(search) || getProductSku(product).toLowerCase().includes(search);
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">Counter POS</p>
                    <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">Create manual order</h1>
                    <p className="mt-1 text-sm text-slate-500">Capture customer details and reserve products in one flow.</p>
                </div>
                <Link href="/manual-order-entry/orders" className="text-sm font-semibold text-slate-600 hover:text-slate-950">
                    View order queue
                </Link>
            </div>

            {successMessage && (
                <output className="block rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
                    {successMessage}
                </output>
            )}

            {serverError && (
                <div role="alert" className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                    <AlertCircle className="size-4 shrink-0" />
                    <span>{serverError}</span>
                </div>
            )}

            {stockWarning && (
                <div role="status" className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
                    <AlertTriangle className="size-4 shrink-0 text-amber-600" />
                    <span>{stockWarning}</span>
                </div>
            )}

            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    void form.handleSubmit();
                }}
                className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]"
            >
                <div className="space-y-5">
                    {/* Customer Details */}
                    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="mb-5 flex items-center gap-3">
                            <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                                <UserRound className="size-4" />
                            </div>
                            <div>
                                <h2 className="text-sm font-bold text-slate-950">Customer details</h2>
                                <p className="text-xs text-slate-500">Required for delivery and tracking</p>
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <form.Field
                                name="customerName"
                                validators={{
                                    onChange: ({ value }) => (!value || value.trim().length < 2 ? "Customer name must be at least 2 characters" : undefined),
                                }}
                            >
                                {(field) => {
                                    const error = field.state.meta.errors[0];
                                    return (
                                        <label className="block">
                                            <span className="mb-1.5 block text-xs font-bold text-slate-700">Customer name *</span>
                                            <input
                                                name={field.name}
                                                value={field.state.value}
                                                onChange={(e) => {
                                                    field.handleChange(e.target.value);
                                                    saveDraftToStorage();
                                                }}
                                                onBlur={field.handleBlur}
                                                placeholder="Full name"
                                                className={`h-11 w-full rounded-xl border px-3 text-sm outline-none transition focus:bg-white ${
                                                    error ? "border-rose-500 bg-rose-50/20 focus:border-rose-500" : "border-slate-200 bg-slate-50 focus:border-emerald-500"
                                                }`}
                                            />
                                            {error && <span className="mt-1 block text-xs font-medium text-rose-600">{String(error)}</span>}
                                        </label>
                                    );
                                }}
                            </form.Field>

                            <form.Field
                                name="customerPhone"
                                validators={{
                                    onChange: ({ value }) => (!value || value.trim().length < 11 ? "Valid 11-digit phone number is required" : undefined),
                                }}
                            >
                                {(field) => {
                                    const error = field.state.meta.errors[0];
                                    return (
                                        <label className="block">
                                            <span className="mb-1.5 block text-xs font-bold text-slate-700">Phone number *</span>
                                            <input
                                                name={field.name}
                                                type="tel"
                                                value={field.state.value}
                                                onChange={(e) => {
                                                    field.handleChange(e.target.value);
                                                    saveDraftToStorage();
                                                }}
                                                onBlur={field.handleBlur}
                                                placeholder="017XXXXXXXX"
                                                className={`h-11 w-full rounded-xl border px-3 text-sm outline-none transition focus:bg-white ${
                                                    error ? "border-rose-500 bg-rose-50/20 focus:border-rose-500" : "border-slate-200 bg-slate-50 focus:border-emerald-500"
                                                }`}
                                            />
                                            {error && <span className="mt-1 block text-xs font-medium text-rose-600">{String(error)}</span>}
                                        </label>
                                    );
                                }}
                            </form.Field>
                        </div>

                        <div className="mt-4">
                            <form.Field
                                name="shippingAddress"
                                validators={{
                                    onChange: ({ value }) =>
                                        !value || value.trim().length < 5
                                            ? "Detailed delivery address is required"
                                            : undefined,
                                }}
                            >
                                {(field) => {
                                    const error = field.state.meta.errors[0];
                                    return (
                                        <label className="block">
                                            <span className="mb-1.5 block text-xs font-bold text-slate-700">Delivery address *</span>
                                            <input
                                                name={field.name}
                                                value={field.state.value}
                                                onChange={(e) => {
                                                    field.handleChange(e.target.value);
                                                    saveDraftToStorage();
                                                }}
                                                onBlur={field.handleBlur}
                                                placeholder="House, road, area and district"
                                                className={`h-11 w-full rounded-xl border px-3 text-sm outline-none transition focus:bg-white ${
                                                    error ? "border-rose-500 bg-rose-50/20 focus:border-rose-500" : "border-slate-200 bg-slate-50 focus:border-emerald-500"
                                                }`}
                                            />
                                            {error && <span className="mt-1 block text-xs font-medium text-rose-600">{String(error)}</span>}
                                        </label>
                                    );
                                }}
                            </form.Field>
                        </div>

                        {/* Delivery Area and Payment (Locked) */}
                        <div className="mt-4 grid gap-4 sm:grid-cols-2">
                            <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-700">Delivery Area</span>
                                    <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200">
                                        Active
                                    </span>
                                </div>
                                <div className="mt-2 flex items-baseline justify-between">
                                    <p className="text-sm font-semibold text-slate-900">Inside Dhaka</p>
                                    <span className="text-xs font-bold text-slate-600">BDT 80</span>
                                </div>
                            </div>

                            <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-700">Payment Method</span>
                                    <span className="rounded-md bg-slate-200/70 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                                        Default
                                    </span>
                                </div>
                                <div className="mt-2 flex items-baseline justify-between">
                                    <p className="text-sm font-semibold text-slate-900">Cash On Delivery (COD)</p>
                                    <span className="text-xs text-slate-500">Pay on receive</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4">
                            <form.Field name="note">
                                {(field) => (
                                    <label className="block">
                                        <span className="mb-1.5 block text-xs font-bold text-slate-700">Order note (optional)</span>
                                        <input
                                            name={field.name}
                                            value={field.state.value}
                                            onChange={(e) => {
                                                field.handleChange(e.target.value);
                                                saveDraftToStorage();
                                            }}
                                            placeholder="Optional instruction for packing or delivery"
                                            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-emerald-500 focus:bg-white"
                                        />
                                    </label>
                                )}
                            </form.Field>
                        </div>
                    </section>

                    {/* Product Picker Section */}
                    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="mb-4 flex items-center justify-between gap-3">
                            <div>
                                <h2 className="text-sm font-bold text-slate-950">Add products</h2>
                                <p className="text-xs text-slate-500">Only available stock can be added to cart</p>
                            </div>
                            <Package className="size-5 text-slate-400" />
                        </div>

                        <label className="relative block">
                            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                            <input
                                value={productSearch}
                                onChange={(e) => setProductSearch(e.target.value)}
                                placeholder="Search by product title or SKU..."
                                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm outline-none focus:border-emerald-500 focus:bg-white"
                            />
                        </label>

                        <div className="mt-4 grid gap-2 sm:grid-cols-2">
                            {productsLoading && <p className="text-sm text-slate-500">Loading inventory...</p>}

                            {filteredProducts.slice(0, 6).map((product) => {
                                const discountAmount = getDiscountAmount(product);
                                const pId = getProductId(product);
                                const isOutOfStock = product.stock < 1;

                                const handleAdd = () => {
                                    if (isOutOfStock) return;
                                    const currentItems = form.getFieldValue("items") || [];
                                    const existingItem = currentItems.find((i) => i.productId === pId);

                                    let nextItems: CartItem[];

                                    if (existingItem) {
                                        if (existingItem.quantity >= product.stock) return;
                                        nextItems = currentItems.map((i) =>
                                            i.productId === pId ? { ...i, quantity: i.quantity + 1 } : i
                                        );
                                    } else {
                                        nextItems = [
                                            ...currentItems,
                                            {
                                                productId: pId,
                                                quantity: 1,
                                                stock: product.stock,
                                                unitPrice: getProductUnitPrice(product),
                                                productName: product.title,
                                                sku: getProductSku(product),
                                                image: getProductImage(product),
                                                brand: getProductBrand(product),
                                                category: getProductCategory(product),
                                                unitType: (product.unitType as any) || "PIECE",
                                                originalPrice: product.originalPrice,
                                                discountAmount,
                                                discountPercent:
                                                    product.originalPrice > product.sellingPrice
                                                        ? Math.round((discountAmount / product.originalPrice) * 100)
                                                        : 0,
                                                discountType: product.discountType as any,
                                            },
                                        ];
                                    }

                                    form.setFieldValue("items", nextItems);
                                    saveDraftToStorage(nextItems);
                                };

                                return (
                                    <button
                                        key={pId}
                                        type="button"
                                        onClick={handleAdd}
                                        disabled={isOutOfStock}
                                        className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 p-3 text-left transition hover:border-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <div className="relative size-12 shrink-0">
                                            <img src={getProductImage(product)} alt={product.title} className="size-12 rounded-lg object-cover" />
                                            {isOutOfStock && (
                                                <span className="absolute inset-0 flex items-center justify-center rounded-lg bg-slate-900/60 text-[10px] font-bold uppercase text-white">
                                                    Out
                                                </span>
                                            )}
                                        </div>
                                        <span className="min-w-0 flex-1">
                                            <span className="block truncate text-sm font-semibold text-slate-900">{product.title}</span>
                                            <span className="mt-0.5 block truncate text-xs text-slate-500">
                                                {getProductBrand(product)} • {isOutOfStock ? <span className="text-rose-600 font-bold">Out of stock</span> : `Stock: ${product.stock}`}
                                            </span>
                                        </span>
                                        <span className="shrink-0 text-right text-sm font-bold text-slate-900">
                                            <span className="block">BDT {product.sellingPrice.toLocaleString()}</span>
                                            {discountAmount > 0 && (
                                                <span className="block text-[11px] font-normal text-slate-400 line-through">
                                                    BDT {product.originalPrice.toLocaleString()}
                                                </span>
                                            )}
                                        </span>
                                    </button>
                                );
                            })}

                            {!productsLoading && filteredProducts.length === 0 && (
                                <p className="text-sm text-slate-500">No matching products found.</p>
                            )}
                        </div>
                    </section>
                </div>

                {/* Sidebar Summary Card */}
                <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:sticky xl:top-20">
                    <form.Field
                        name="items"
                        validators={{
                            onChange: ({ value }) => (!value || value.length === 0 ? "You must add at least one item to cart" : undefined),
                        }}
                    >
                        {(field) => {
                            const currentItems = field.state.value;
                            const subtotal = currentItems.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
                            const totalDiscount = currentItems.reduce(
                                (acc, item) => acc + (item.discountAmount ? item.discountAmount * item.quantity : 0),
                                0
                            );
                            const deliveryFee = 80;
                            const total = subtotal + deliveryFee;

                            const updateQty = (productId: string, delta: number) => {
                                const liveProduct = products.find((p) => (p.id || p.title) === productId);
                                const maxStock = liveProduct ? liveProduct.stock : 999;

                                const updated = currentItems.flatMap((item) => {
                                    if (item.productId !== productId) return [item];
                                    const nextQty = item.quantity + delta;

                                    if (nextQty > maxStock) return [item];
                                    return nextQty > 0 ? [{ ...item, quantity: nextQty, stock: maxStock }] : [];
                                });

                                field.handleChange(updated);
                                saveDraftToStorage(updated);
                            };

                            const removeItem = (productId: string) => {
                                const next = currentItems.filter((i) => i.productId !== productId);
                                field.handleChange(next);
                                saveDraftToStorage(next);
                            };

                            return (
                                <div>
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-sm font-bold text-slate-950">Order summary</h2>
                                        <span className="text-xs text-slate-500">{currentItems.length} products</span>
                                    </div>

                                    <div className="mt-4 space-y-3">
                                        {currentItems.map((item) => {
                                            const hasDiscount = Boolean(item.discountAmount && item.discountAmount > 0);
                                            const liveProduct = products.find((p) => (p.id || p.title) === item.productId);
                                            const isStockExceeded = liveProduct && liveProduct.stock < item.quantity;

                                            return (
                                                <div key={item.productId} className={`rounded-xl p-3 border transition ${isStockExceeded ? 'bg-rose-50/50 border-rose-200' : 'bg-slate-50 border-transparent'}`}>
                                                    <div className="flex items-start gap-3">
                                                        <img
                                                            src={item.image || "/placeholder-product.jpg"}
                                                            alt=""
                                                            className="size-12 shrink-0 rounded-lg object-cover"
                                                        />
                                                        <div className="min-w-0 flex-1">
                                                            <div className="flex items-start justify-between gap-2">
                                                                <div className="min-w-0">
                                                                    <p className="truncate text-sm font-semibold text-slate-900">{item.productName}</p>
                                                                    <p className="mt-0.5 text-xs text-slate-500">
                                                                        BDT {item.unitPrice.toLocaleString()} /{" "}
                                                                        <span className="uppercase font-medium text-slate-700">{item.unitType || "PIECE"}</span>
                                                                        {hasDiscount && (
                                                                            <span className="ml-1.5 text-[11px] text-slate-400 line-through">
                                                                                BDT {item.originalPrice?.toLocaleString()}
                                                                            </span>
                                                                        )}
                                                                    </p>

                                                                    {hasDiscount && (
                                                                        <p className="mt-0.5 text-[11px] font-semibold text-rose-600">
                                                                            Save BDT {((item.discountAmount || 0) * item.quantity).toLocaleString()}
                                                                            {item.discountType === "PERCENTAGE" && ` (${item.discountPercent}%)`}
                                                                        </p>
                                                                    )}

                                                                    {isStockExceeded && (
                                                                        <span className="mt-1 block text-[11px] font-semibold text-rose-600">
                                                                            Stock exceeded! Only {liveProduct?.stock} left.
                                                                        </span>
                                                                    )}
                                                                </div>

                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeItem(item.productId)}
                                                                    className="text-slate-400 hover:text-rose-600"
                                                                >
                                                                    <Trash2 className="size-4" />
                                                                </button>
                                                            </div>

                                                            {/* Quantity & Unit Controller */}
                                                            <div className="mt-3 flex items-center justify-between">
                                                                <div className="flex items-center gap-1.5">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => updateQty(item.productId, -1)}
                                                                        className="flex size-7 items-center justify-center rounded-lg border border-slate-200 bg-white"
                                                                    >
                                                                        <Minus className="size-3" />
                                                                    </button>

                                                                    <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-white border border-slate-200">
                                                                        <span className="text-xs font-bold text-slate-900">{item.quantity}</span>
                                                                        <span className="text-[10px] font-semibold uppercase text-slate-500">
                                                                            {item.unitType || "PCS"}
                                                                        </span>
                                                                    </div>

                                                                    <button
                                                                        type="button"
                                                                        onClick={() => updateQty(item.productId, 1)}
                                                                        disabled={Boolean(liveProduct && item.quantity >= liveProduct.stock)}
                                                                        className="flex size-7 items-center justify-center rounded-lg border border-slate-200 bg-white disabled:opacity-40"
                                                                    >
                                                                        <Plus className="size-3" />
                                                                    </button>
                                                                </div>

                                                                <span className="text-sm font-bold text-slate-900">
                                                                    BDT {(item.unitPrice * item.quantity).toLocaleString()}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}

                                        {currentItems.length === 0 && (
                                            <div className="rounded-xl border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-500">
                                                Select items from the left to create an order.
                                            </div>
                                        )}
                                    </div>

                                    {field.state.meta.errors[0] && (
                                        <p className="mt-2 text-xs font-semibold text-rose-600">{String(field.state.meta.errors[0])}</p>
                                    )}

                                    {/* Summary Totals */}
                                    <div className="mt-5 space-y-2 border-t border-slate-100 pt-4 text-sm">
                                        <div className="flex justify-between text-slate-500">
                                            <span>Subtotal</span>
                                            <span>BDT {subtotal.toLocaleString()}</span>
                                        </div>

                                        {totalDiscount > 0 && (
                                            <div className="flex justify-between text-rose-600 font-medium">
                                                <span>Total Savings</span>
                                                <span>- BDT {totalDiscount.toLocaleString()}</span>
                                            </div>
                                        )}

                                        <div className="flex justify-between text-slate-500">
                                            <span>Delivery fee</span>
                                            <span>BDT {deliveryFee.toLocaleString()}</span>
                                        </div>

                                        <div className="flex justify-between pt-2 text-base font-bold text-slate-950 border-t border-slate-100">
                                            <span>Total Payable</span>
                                            <span>BDT {total.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={createOrderMutation.isPending || currentItems.length === 0}
                                        className="mt-5 h-11 w-full bg-emerald-600 text-white hover:bg-emerald-700"
                                    >
                                        {createOrderMutation.isPending ? "Creating order..." : "Confirm & Place Order"}
                                    </Button>
                                </div>
                            );
                        }}
                    </form.Field>
                </aside>
            </form>
        </div>
    );
}