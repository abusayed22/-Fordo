import z from "zod";

export const createBrandZodSchema = z.object({
    name: z.string("Brand name is required").min(3, "Brand name must be minimum 3 characters.").max(50, "Brand name must be maximum 50 characters."),
});