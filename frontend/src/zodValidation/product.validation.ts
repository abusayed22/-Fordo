import z from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const productCreateZodSchema = z
  .object({
    // Backend: title: z.string().min(3).max(100)
    title: z
      .string()
      .trim()
      .min(3, "Title must be at least 3 characters")
      .max(100, "Title cannot exceed 100 characters"),

    // Backend: categoryId: z.string().uuid()
    categoryId: z.string().uuid("Invalid category ID"),

    // Backend: brandId: z.string().uuid().optional()
    brandId: z
      .string()
      .uuid("Invalid brand ID")
      .optional()
      .or(z.literal("")),

    // Backend: description: z.string().optional()
    description: z.string().trim().optional().or(z.literal("")),

    // Backend: costPrice, originalPrice, sellingPrice > 0 (positive)
    costPrice: z.coerce
      .number()
      .positive("Cost price must be greater than 0"),
    originalPrice: z.coerce
      .number()
      .positive("Original price must be greater than 0"),
    sellingPrice: z.coerce
      .number()
      .positive("Selling price must be greater than 0"),

    // Backend: stock >= 0
    stock: z.coerce
      .number()
      .int("Stock must be a whole number")
      .min(0, "Stock cannot be negative"),

    // Backend: unitType: z.nativeEnum(ProductUnit)
    unitType: z.enum(
      [
        "KG",
        "GM",
        "MG",
        "LITER",
        "ML",
        "PIECE",
        "PACKET",
        "BOX",
        "DOZEN",
        "PAIR",
        "BUNDLE",
        "BAG",
        "BOTTLE",
        "CAN",
      ],
      {
        error: "Invalid product unit",
      }
    ),

    // Backend: unitValue: z.coerce.number().positive().optional()
    unitValue: z.coerce
      .number()
      .positive("Unit value must be greater than 0")
      .optional(),

    // Backend: isDiscounted: z.coerce.boolean().optional()
    isDiscounted: z.coerce.boolean().default(false),

    // Backend: discountType: z.nativeEnum(DiscountType).optional()
    discountType: z
      .enum(["PERCENTAGE", "FIXED_AMOUNT"])
      .optional()
      .default("PERCENTAGE"),

    // Backend: discountValue: z.coerce.number().min(0).optional()
    discountValue: z.coerce
      .number()
      .min(0, "Discount value cannot be negative")
      .optional()
      .default(0),

    // Backend: discountExpires: z.coerce.date().optional()
    discountExpires: z.string().optional().or(z.literal("")),

    // Backend: supplierName, invoiceNo: z.string().optional()
    supplierName: z.string().trim().optional().or(z.literal("")),
    invoiceNo: z.string().trim().optional().or(z.literal("")),

    // Multipart File Validation (Frontend specific)
    file: z
      .custom<File>(
        (val) => typeof File !== "undefined" && val instanceof File,
        "Product image is required"
      )
      .refine((f) => Boolean(f && f.size > 0), "Product image is required")
      .refine((f) => f.size <= MAX_FILE_SIZE, "Max image size is 5MB")
      .refine(
        (f) => ACCEPTED_IMAGE_TYPES.includes(f.type),
        "Only .jpg, .jpeg, .png and .webp formats are supported"
      ),
  })
  .superRefine((data, context) => {
    const original = Number(data.originalPrice) || 0;
    const selling = Number(data.sellingPrice) || 0;
    const discount = Number(data.discountValue) || 0;

    // Selling price মূল মূল্যের বেশি হতে পারবে না
    if (selling > original) {
      context.addIssue({
        code: "custom",
        path: ["sellingPrice"],
        message: "Selling price cannot exceed the original price",
      });
    }

    // ডিসকাউন্ট নিষ্ক্রিয় থাকলে মান ০ হতে হবে
    if (!data.isDiscounted && discount > 0) {
      context.addIssue({
        code: "custom",
        path: ["discountValue"],
        message: "Set discount to 0 when discounts are disabled",
      });
    }

    // পার্সেন্টেজ ডিসকাউন্ট ১০০% এর বেশি হতে পারবে না
    if (data.isDiscounted && data.discountType === "PERCENTAGE" && discount > 100) {
      context.addIssue({
        code: "custom",
        path: ["discountValue"],
        message: "Percentage discount cannot exceed 100%",
      });
    }

    // ফিক্সড অ্যামাউন্ট ডিসকাউন্ট মূল দামের বেশি হতে পারবে না
    if (data.isDiscounted && data.discountType === "FIXED_AMOUNT" && discount > original) {
      context.addIssue({
        code: "custom",
        path: ["discountValue"],
        message: "Fixed amount discount cannot exceed original price",
      });
    }
  });


  export type ProductCreateFormData = z.infer<typeof productCreateZodSchema>;
