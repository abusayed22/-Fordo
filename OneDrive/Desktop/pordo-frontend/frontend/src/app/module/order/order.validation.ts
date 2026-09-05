import z from "zod";
import { OrderStatus, PaymentGateway, PaymentStatus } from "../../../generated/prisma/enums";






export const createOrderSchema = z.object({
    addressId: z.string().uuid("Invalid address ID"),
    items: z
      .array(
        z.object({
          productId: z.string().uuid("Invalid product ID"),
          quantity: z.coerce.number().positive("Quantity must be greater than 0"),
        })
      )
      .min(1, "Order must contain at least one item"),
    deliveryFee: z.coerce.number().min(0).default(0),
    discountAmount: z.coerce.number().min(0).default(0),
    paymentMethod: z.nativeEnum(PaymentGateway).default(PaymentGateway.COD),
    note: z.string().optional(),
    deliveryDate: z.coerce.date().optional(),
    isManual: z.boolean().optional().default(false),
});

export const updateOrderStatusSchema = z.object({
    status: z.nativeEnum(OrderStatus).optional(),
    paymentStatus: z.nativeEnum(PaymentStatus).optional(),
    deliveryDate: z.coerce.date().optional(),
    note: z.string().optional(),
});



