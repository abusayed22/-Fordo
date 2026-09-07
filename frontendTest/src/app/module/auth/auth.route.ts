import { Router } from "express";
import { AuthController } from "./auth.controller";
import { UserRole } from "../../../generated/prisma/enums";
import { checkAuth } from "../../middleware/checkAuth";


const route = Router();

route.post("/registration", AuthController.authRegister);
route.post("/login", AuthController.authLogin);
route.get("/me", checkAuth(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.DELIVERY_MAN, UserRole.MANAGER, UserRole.MANUAL_ORDER_ENTRY), AuthController.getMe);
route.post("/refresh-token", AuthController.getNewToken);
route.post("/change-password",checkAuth(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.DELIVERY_MAN, UserRole.MANAGER, UserRole.MANUAL_ORDER_ENTRY),AuthController.changePassword);
route.post("/logout",checkAuth(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.DELIVERY_MAN, UserRole.MANAGER, UserRole.MANUAL_ORDER_ENTRY),AuthController.logoutUser);
route.post("/verify-email",AuthController.verifyEmail);



export const AuthRoute = route;
