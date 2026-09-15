import { Router } from "express";
import { ValidationRequest } from "../../middleware/validationRequest";
import { createOrderSchema, updateOrderStatusSchema } from "./order.validation";
import { OrderController } from "./order.controller";
import { UserRole } from "../../../generated/prisma/enums";
import { checkAuth } from "../../middleware/checkAuth";

const route = Router();



// নতুন অর্ডার প্লেস (কাস্টমার বা অ্যাডমিন)
route.post(
  "/",
  checkAuth(UserRole.CUSTOMER, UserRole.ADMIN, UserRole.MANAGER,UserRole.MANUAL_ORDER_ENTRY),
  ValidationRequest(createOrderSchema),
  OrderController.createOrder
);

// সব অর্ডার লিস্ট দেখা (রোল অনুযায়ী ফিল্টার হবে)
route.get(
  "/",
  checkAuth(UserRole.CUSTOMER, UserRole.ADMIN, UserRole.MANAGER,UserRole.MANUAL_ORDER_ENTRY),
  OrderController.getOrders
);

// নির্দিষ্ট অর্ডারের বিস্তারিত দেখা
route.get(
  "/:id",
  checkAuth(UserRole.CUSTOMER, UserRole.ADMIN, UserRole.MANAGER),
  OrderController.getSingleOrder
);

// অর্ডারের স্ট্যাটাস পরিবর্তন করা (শুধু অ্যাডমিন ও ম্যানেজার)
route.patch(
  "/:id/status",
  checkAuth(UserRole.ADMIN, UserRole.MANAGER),
  ValidationRequest(updateOrderStatusSchema),
  OrderController.updateOrderStatus
);


export const OrderRoute = route;
