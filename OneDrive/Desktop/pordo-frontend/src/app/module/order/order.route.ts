import { Router } from "express";
import { ValidationRequest } from "../../middleware/validationRequest";
import { createOrderSchema, updateOrderStatusSchema } from "./order.validation";
import { OrderController } from "./order.controller";

const route = Router();

// ১. অর্ডার প্লেস করা
route.post(
  "/",
  // authGuard("CUSTOMER", "ADMIN", "STAFF"),
  ValidationRequest(createOrderSchema),
  OrderController.createOrder
);


// route.get(
//   "/",
//   OrderController.getAllOrders
// );

route.get(
  "/:id",
  // authGuard("CUSTOMER", "ADMIN", "STAFF"),
  OrderController.getSingleOrder
);


route.patch(
  "/:id/status",
  // authGuard("ADMIN", "STAFF"),
  ValidationRequest(updateOrderStatusSchema),
  OrderController.updateOrderStatus
);

export const OrderRoutes = route;
