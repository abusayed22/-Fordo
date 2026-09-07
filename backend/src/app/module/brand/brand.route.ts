import { Router } from "express";
import { BrandController } from "./brand.controller";
// import { checkAuth } from "../../middleware/checkAuth";
// import { UserRole } from "../../../generated/prisma/enums";
import { ValidationRequest } from "../../middleware/validationRequest";
import { multerUpload } from "../../../config/multer";
import { createBrandZodSchema } from "./brand.validation";



const route = Router();



route.get('/',BrandController.brandFetch )
route.delete('/:id',BrandController.brandDelete)
route.put('/:id',BrandController.brandUpdate)
route.post('/',multerUpload.single("file"),ValidationRequest(createBrandZodSchema), BrandController.brandCreate);




export const BrandRoute = route

