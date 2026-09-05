import { Request, Response } from "express";
import sendResponse from "../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import asyncCatch from "../../shared/asyncCatch";
import { CategoryService } from "./category.service";


const categoryCreate = asyncCatch(async(req:Request,res:Response) => {
        const result = await CategoryService.categoryCreate(req.body);
        sendResponse(res,{success:true,message:"Category created successfully",data:result,statusCode:StatusCodes.CREATED});
});



const categoryGet = asyncCatch(async(req:Request,res:Response) => {
        const result = await CategoryService.categoryGet();
         sendResponse(res,{success:true,message:"Category fetched successfully",data:result,statusCode:StatusCodes.OK});
    })



const categoryDelete = asyncCatch(async(req:Request,res:Response) => {

    const {id} = req.params;
        const result = await CategoryService.CategoryDelete(id as string);
         sendResponse(res,{success:true,message:"Category Delete successfully",data:result,statusCode:StatusCodes.CREATED});

})


const categoryUpdate = asyncCatch(async(req:Request,res:Response) => {
            const {id} = req.params;
        const payload = req.body;
        const result = await CategoryService.categoryUpdate(id as string,payload);
         res.status(StatusCodes.OK).json({success:true,message:"Category Update successfully",data:result})
          sendResponse(res,{success:true,message:"Category Update successfully",data:result,statusCode:StatusCodes.OK});
         
})





export const CategoryController = {categoryCreate,categoryGet,categoryDelete,categoryUpdate}




