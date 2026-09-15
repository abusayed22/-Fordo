import {  Router } from "express";
import { ProductController } from "./product.controller";
import { ValidationRequest } from "../../middleware/validationRequest";
import { createProductSchema, stockInSchema, updateProductDetailsSchema } from "./product.validation";
import { checkAuth } from "../../middleware/checkAuth";
import { multerUpload } from "../../../config/multer";
import { UserRole } from "../../../generated/prisma/enums";


const route = Router()



// route.get("/check", ProductController.  );


route.post(
	"/",
	checkAuth(UserRole.ADMIN, UserRole.MANAGER),
	multerUpload.array("file"),
	ValidationRequest(createProductSchema),
	ProductController.createProduct 
);

route.get("/",ProductController.getAllProducts);
route.get("/:id",ProductController.getSingleProduct);
route.put("/:id",ValidationRequest(updateProductDetailsSchema),ProductController.updateProduct);
route.delete("/:id",ProductController.deleteProduct);
route.post("/stock-in",ValidationRequest(stockInSchema), ProductController.stockInProduct);
route.post("/:id/adjust-stock",ValidationRequest(stockInSchema), ProductController.stockInProduct);





export const ProductRoute = route;




