import { Router } from "express";
import { BrandRoute } from "../module/brand/brand.route";
import { AuthRoute } from "../module/auth/auth.route";
import { CategoryRoute } from "../module/category/category.route";
import { AddressRoute } from "../module/address/address.route";
import { ProductRoute } from "../module/product/product.route";
import { OrderRoute } from "../module/order/order.route";


const route = Router();

// brand route
route.use('/brand',BrandRoute);
route.use('/auth',AuthRoute);
route.use('/category',CategoryRoute);
route.use('/address',AddressRoute);
route.use('/product',ProductRoute);
route.use('/order',OrderRoute);


export const indexRoute = route;