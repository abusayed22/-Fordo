
import { Router } from "express";
import { CategoryController } from "./category.controller";
import { createCategorySchema, updateCategorySchema } from "./category.validation";
import { ValidationRequest } from "../../middleware/validationRequest";
import { checkAuth } from "../../middleware/checkAuth";
import { UserRole } from "../../../generated/prisma/enums";
import { multerUpload } from "../../../config/multer";



const route = Router();


route.get('/',CategoryController.categoryGet)
route.delete('/:id',checkAuth(UserRole.ADMIN),CategoryController.categoryDelete)
route.put('/:id',checkAuth(UserRole.ADMIN,UserRole.MANAGER),ValidationRequest(updateCategorySchema),CategoryController.categoryUpdate)
route.post('/', checkAuth(UserRole.ADMIN,UserRole.MANAGER,UserRole.CUSTOMER),multerUpload.single("file"), ValidationRequest(createCategorySchema),CategoryController.categoryCreate);

export const CategoryRoute = route;