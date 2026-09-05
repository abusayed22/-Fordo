import z from "zod";
import { DiscountType, ProductUnit } from "../../../generated/prisma/enums";



export const createProductSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters").max(100),
    categoryId: z.string().uuid("Invalid category ID"),
    brandId: z.string().uuid("Invalid brand ID").optional(),
    description: z.string().optional(),
    costPrice: z.coerce.number().positive("Cost price must be greater than 0"),
    originalPrice: z.coerce.number().positive("Original price must be greater than 0"),
    sellingPrice: z.coerce.number().positive("Selling price must be greater than 0"),
    stock: z.coerce.number().min(0, "Stock cannot be negative"),
    unit: z.nativeEnum(ProductUnit, {message: "Invalid product unit",}),
    unitValue: z.coerce.number().positive().optional(),
    isDiscounted: z.coerce.boolean().optional(),
    discountType: z.nativeEnum(DiscountType).optional(),
    discountValue: z.coerce.number().min(0).optional(),
    discountExpires: z.coerce.date().optional(),
    supplierName: z.string().optional(),
    invoiceNo: z.string().optional(),
});





export const stockInSchema = z.object({
    productId: z.string().uuid("Invalid product ID"),
    quantity: z.coerce.number().positive("Quantity must be greater than 0"),
    unitCost: z.coerce.number().positive("Unit cost must be greater than 0"),
    newSellingPrice: z.coerce.number().positive().optional(),
    supplierName: z.string().optional(),
    invoiceNo: z.string().optional(),
});

export const updateProductDetailsSchema = z.object({
    title: z.string().min(3).max(100).optional(),
    description: z.string().optional(),
    categoryId: z.string().uuid().optional(),
    brandId: z.string().uuid().optional(),
    originalPrice: z.coerce.number().positive().optional(),
    sellingPrice: z.coerce.number().positive().optional(),
    isDiscounted: z.coerce.boolean().optional(),
    discountType: z.nativeEnum(DiscountType).optional(),
    discountValue: z.coerce.number().min(0).optional(),
    discountExpires: z.coerce.date().optional(),
    isAvailable: z.coerce.boolean().optional(),
});
