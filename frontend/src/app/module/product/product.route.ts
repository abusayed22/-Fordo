import { Router } from "express";
import { ProductController } from "./product.controller";
import { ValidationRequest } from "../../middleware/validationRequest";
import { createProductSchema, stockInSchema, updateProductDetailsSchema } from "./product.validation";


const route = Router()



// route.get("/check", ProductController.  );


route.post("/",ValidationRequest(createProductSchema), ProductController.createProduct);

route.get("/:id",ProductController.getSingleProduct);
route.put("/:id",ValidationRequest(updateProductDetailsSchema),ProductController.updateProduct);
route.delete("/:id",ProductController.deleteProduct);
route.post("/stock-in",ValidationRequest(stockInSchema), ProductController.stockInProduct);





export const ProductRoute = route;




