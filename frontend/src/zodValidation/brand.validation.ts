import { z } from "zod";

export const brandCreateZodSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Brand name must be at least 2 characters long" })
    .max(100, { message: "Brand name must be 100 characters or fewer" }),
  logo: z.instanceof(File).nullable(),
});

export const brandUpdateZodSchema = z.object({
  name: brandCreateZodSchema.shape.name,
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

export type BrandCreateFormData = z.infer<typeof brandCreateZodSchema>;
