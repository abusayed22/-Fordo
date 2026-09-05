import { Router } from "express";
import { BrandController } from "./brand.controller";



const route = Router();



route.get('/',BrandController.brandFetch )
route.delete('/:id',BrandController.brandDelete)
route.put('/:id',BrandController.brandUpdate)
route.post('/', BrandController.brandCreate);




export const BrandRoute = route

