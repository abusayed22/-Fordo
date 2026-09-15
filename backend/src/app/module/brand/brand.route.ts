import { Router } from "express";
import { BrandController } from "./brand.controller";
// import { checkAuth } from "../../middleware/checkAuth";
// import { UserRole } from "../../../generated/prisma/enums";
import { ValidationRequest } from "../../middleware/validationRequest";
import { multerUpload } from "../../../config/multer";
import { createBrandZodSchema, updateBrandZodSchema } from "./brand.validation";
import { checkAuth } from "../../middleware/checkAuth";
import { UserRole } from "../../../generated/prisma/enums";



const route = Router();



route.get('/',BrandController.brandFetch )
route.delete('/:id',checkAuth(UserRole.ADMIN,UserRole.MANAGER,UserRole.CUSTOMER),BrandController.brandDelete)
route.patch('/:id',checkAuth(UserRole.ADMIN,UserRole.MANAGER,UserRole.CUSTOMER),multerUpload.single("file"),ValidationRequest(updateBrandZodSchema),BrandController.brandUpdate);
route.post('/',checkAuth(UserRole.ADMIN,UserRole.MANAGER,UserRole.CUSTOMER),multerUpload.single("file"),ValidationRequest(createBrandZodSchema), BrandController.brandCreate);




export const BrandRoute = route

