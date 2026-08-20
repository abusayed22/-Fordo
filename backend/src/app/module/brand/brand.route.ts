import { Router } from "express";
import { BrandController } from "./brand.controller";



const route = Router();



route.get('/',BrandController.brandFetch )


route.post('/', BrandController.brandCreate);




export const brandRoute = route

