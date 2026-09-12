import z from "zod";




export const productCreateZodSchema = z.object({
    title: z.string().min(1).max(255),
    slug: z.string().min(1).max(255).optional(),
    description: z.string().min(1).max(255),
    summary: z.string().min(1).max(255),
    categoryId: z.string().min(1).max(255),
    brandId: z.string().min(1).max(255),
    approvalStatus: z.enum(["APPROVED", "PENDING", "REJECTED"]),
    costPrice: z.number().min(0),
    originalPrice: z.number().min(0),    
    sellingPrice: z.number().min(0),
    isDiscounted: z.boolean(),
    discountType: z.enum(["PERCENTAGE", "FLAT"]),
    discountValue: z.number().min(0),
    discountExpires: z.string().min(1).max(255),
    stock: z.number().min(0),
    unit: z.enum(["PIECE", "KG", "GM", "LITER", "ML", "PACK", "BOX", "DOZEN", "METER"]),
    unitValue: z.number().min(0),
    supplierName: z.string().min(1).max(255).optional(),
    invoiceNo: z.string().min(1).max(255).optional(),
    isAvailable: z.boolean().optional(),
    image: z.string().min(1).max(255).optional(),
    images: z.array(z.string().min(1).max(255)).optional(),
});



export type IProductCreateFormData = z.infer<typeof productCreateZodSchema>;




