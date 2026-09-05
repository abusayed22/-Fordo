
import { Router } from "express";
import { AddressController } from "./address.controller";



const route = Router();



route.post("/", AddressController.addressCreate);
route.get("/user/:userId", AddressController.getAddressesByUser);
route.get("/:id/user/:userId", AddressController.getAddressById);
route.put("/:id/user/:userId", AddressController.addressUpdate);
route.delete("/:id/user/:userId", AddressController.addressDelete);

export const AddressRoute = route
