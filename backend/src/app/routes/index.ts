import { Router } from "express";
import { brandRoute } from "../module/brand/brand.route";


const route = Router();

// brand route
route.use('/brand',brandRoute);


export const indexRoute = route;