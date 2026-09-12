import { z } from "zod";

export const categoryCreateZodSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Category name must be at least 2 characters long" })
    .max(100, { message: "Category name must be 100 characters or fewer" }),
  logo: z
    .custom<File>(
      (value) =>
        typeof File !== "undefined" &&
        value instanceof File &&
        value.size > 0 &&
        value.type.startsWith("image/"),
      { message: "Please choose a valid image file" },
    )
    .nullable()
    .refine((file) => file !== null, {
      message: "Category logo is required",
    }),
});

export const categoryUpdateZodSchema = z.object({
  name: categoryCreateZodSchema.shape.name,
  logo: z
    .custom<File>(
      (value) =>
        typeof File !== "undefined" &&
        value instanceof File &&
        value.size > 0 &&
        value.type.startsWith("image/"),
      { message: "Please choose a valid image file" },
    )
    .nullable(),
});

export type CategoryCreateFormData = z.infer<typeof categoryCreateZodSchema>;
