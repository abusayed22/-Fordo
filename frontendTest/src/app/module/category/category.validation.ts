import z from "zod";



export const createCategorySchema = z.object({
    name: z.string().min(3, "Name is required & must be minimum 3 characters").max(20, "Name is required & must be maximum 20 characters"),
    logo: z.string().optional(),
});

// Update Category Schema
export const updateCategorySchema = z.object({
    name: z.string().min(3, "Name is required & must be minimum 3 characters").max(20, "Name is required & must be maximum 20 characters").optional(),
    logo: z.string().optional(),
    isDeleted: z.boolean().optional(),
});



