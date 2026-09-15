import { z } from "zod";

export const orderItemSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  productName: z.string().min(1, "Product name is required"),
  sku: z.string().min(1, "SKU is required"),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
  unitPrice: z.number().positive("Price must be greater than 0"),
  image: z.string().optional(),
  brand: z.string().optional(),
  category: z.string().optional(),
  originalPrice: z.number().positive().optional(),
  discountAmount: z.number().min(0).optional(),
  discountPercent: z.number().min(0).max(100).optional(),
  discountType: z.string().optional(),
  unitType: z.string().optional(),
});

export const createOrderSchema = z.object({
  addressId: z.string().optional().nullable(),
  customerName: z.string().trim().min(2, "Customer name is required"),
  customerPhone: z.string().trim().min(7, "Enter a valid phone number"),
  shippingAddress: z.string().trim().min(5, "Delivery address is required"),
  deliveryZone: z.enum(["Inside Dhaka", "Outside Dhaka"]),
  paymentMethod: z.enum(["COD", "BKASH", "NAGAD"]),
  note: z.string().trim().max(500, "Note cannot exceed 500 characters").optional(),
  items: z.array(orderItemSchema).min(1, "Add at least one product"),
});

export type CreateOrderPayload = z.infer<typeof createOrderSchema>;
