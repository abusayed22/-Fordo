import { z } from "zod";
import { PaymentGateway, OrderStatus } from "../../../generated/prisma/enums";

export const createOrderSchema = z.object({
  // body: z.object({
    addressId: z.string({ message: "Address ID is required" }).min(1, "Address ID cannot be empty"),

    deliveryFee: z.number().nonnegative().optional().default(0),
    discountAmount: z.number().nonnegative().optional().default(0),
    paymentMethod: z.nativeEnum(PaymentGateway).optional().default(PaymentGateway.COD),

    customerName: z.string({ message: "Customer name is required" }).trim().min(2, "Customer name must be at least 2 characters"),

    customerPhone: z.string({ message: "Customer phone is required" }).trim().min(11, "Customer phone must be a valid number"),

    customerEmail: z.string().email("Invalid email address").optional().or(z.literal("")),

    shippingAddress: z.string({ message: "Shipping address is required" }).trim().min(5, "Shipping address must be detailed"),

    note: z.string().optional(),

    items: z
      .array(
        z.object({
          productId: z.string({ message: "Product ID is required" }).min(1, "Product ID cannot be empty"),
          quantity: z.number().positive("Quantity must be greater than 0"),
        })
      )
      .min(1, "Order must contain at least one item"),
  // }),
});

export const updateOrderStatusSchema = z.object({
  body: z.object({
    status: z.nativeEnum(OrderStatus),
  }),
});