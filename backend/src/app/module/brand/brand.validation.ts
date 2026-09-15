import z from "zod";

export const createBrandZodSchema = z.object({
      name: z.string().min(3, "Name is required & must be minimum 3 characters").max(20, "Name is required & must be maximum 20 characters"),
    logo: z.string().optional(),
});

export const updateBrandZodSchema = z.object({
      name: z.string().min(3, "Name is required & must be minimum 3 characters").max(20, "Name is required & must be maximum 20 characters"),
    logo: z.string().optional(),
});