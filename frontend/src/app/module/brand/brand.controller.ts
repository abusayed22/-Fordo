import { Request, Response } from "express";
import { BrandService } from "./brand.service";
import asyncCatch from "../../shared/asyncCatch";
import sendResponse from "../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";



const brandCreate = asyncCatch(async(req:Request,res:Response) => {
        const result = await BrandService.createBrand(req.body);
        sendResponse(res,{success:true,message:"Brand created successfully",data:result,statusCode:StatusCodes.CREATED});
})


// fetch all brand
const brandFetch = asyncCatch(async(req:Request,res:Response) => {
        const result = await BrandService.brandFetch();
         sendResponse(res,{success:true,message:"Brand fetched successfully",data:result,statusCode:StatusCodes.OK});
    })



const brandDelete = asyncCatch(async(req:Request,res:Response) => {

    const {id} = req.params;
        const result = await BrandService.brandDelete(id as string);
         sendResponse(res,{success:true,message:"Brand Delete successfully",data:result,statusCode:StatusCodes.CREATED});

})


const brandUpdate = asyncCatch(async(req:Request,res:Response) => {
            const {id} = req.params;
        const payload = req.body;
        const result = await BrandService.brandUpdate(id as string,payload);
         res.status(StatusCodes.OK).json({success:true,message:"Brand Update successfully",data:result})
          sendResponse(res,{success:true,message:"Brand Update successfully",data:result,statusCode:StatusCodes.OK});
         
})


export const BrandController = {brandCreate,brandFetch,brandDelete,brandUpdate}