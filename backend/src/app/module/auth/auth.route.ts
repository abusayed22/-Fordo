import { Router } from "express";
import { AuthController } from "./auth.controller";
import { UserRole } from "../../../generated/prisma/enums";
import { checkAuth } from "../../middleware/checkAuth";
import { ValidationRequest } from "../../middleware/validationRequest";
import { loginSchema, registerSchema } from "./auth.validation";


const route = Router();

route.post("/registration",ValidationRequest(registerSchema), AuthController.authRegister);
route.post("/login",ValidationRequest(loginSchema), AuthController.authLogin);
route.get("/me", checkAuth(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.DELIVERY_MAN, UserRole.MANAGER, UserRole.MANUAL_ORDER_ENTRY), AuthController.getMe);
route.post("/refresh-token", AuthController.getNewToken);
route.post("/change-password",checkAuth(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.DELIVERY_MAN, UserRole.MANAGER, UserRole.MANUAL_ORDER_ENTRY),AuthController.changePassword);
route.post("/logout",checkAuth(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.DELIVERY_MAN, UserRole.MANAGER, UserRole.MANUAL_ORDER_ENTRY),AuthController.logoutUser);
route.post("/verify-email",AuthController.verifyEmail);
route.post("/forgot-password",AuthController.forgotPassword);
route.post("/reset-password",AuthController.resetPassword);



export const AuthRoute = route;
