import { Request, Response } from "express";
import sendResponse from "../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import asyncCatch from "../../shared/asyncCatch";
import { AddressService } from "./address.service";


const addressCreate = asyncCatch(async(req:Request,res:Response) => {
        const result = await AddressService.addressCreate(req.body);
        sendResponse(res,{success:true,message:"Category created successfully",data:result,statusCode:StatusCodes.CREATED});
});


const getAddressesByUser = asyncCatch(async (req: Request, res: Response) => {

    const { userId } = req.params;
    const result = await AddressService.getAddressesByUser(userId as string);
    sendResponse(res,{success:true,message:"Addresses created successfully",data:result,statusCode:StatusCodes.CREATED});

});

const getAddressById = asyncCatch(async (req: Request, res: Response) => {

    const { id, userId } = req.params;
    const result = await AddressService.getAddressById(id as string, userId as string);
    sendResponse(res,{success:true,message:"Addresses created successfully",data:result,statusCode:StatusCodes.CREATED});
  
});

// unnessecery TODO:
// const addressGet = asyncCatch(async(req:Request,res:Response) => {
//         const result = await AddressService.addressGet();
//          sendResponse(res,{success:true,message:"Address fetched successfully",data:result,statusCode:StatusCodes.OK});
//     })



const addressDelete = asyncCatch(async(req:Request,res:Response) => {

    const {id,userId} = req.params;
        const result = await AddressService.addressDelete(id as string,userId as string);
         sendResponse(res,{success:true,message:"Address Delete successfully",data:result,statusCode:StatusCodes.CREATED});

})


const addressUpdate = asyncCatch(async(req:Request,res:Response) => {
            const {id,userId} = req.params;
        const payload = req.body;
        const result = await AddressService.addressUpdate(id as string,userId as string,payload);
          sendResponse(res,{success:true,message:"Address Update successfully",data:result,statusCode:StatusCodes.OK});
         
})





export const AddressController = {addressCreate,addressDelete,addressUpdate,getAddressesByUser,getAddressById}




