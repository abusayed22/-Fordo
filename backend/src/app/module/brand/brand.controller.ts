import { Request, Response } from "express";
import { BrandService } from "./brand.service";


const brandCreate = async(req:Request,res:Response) => {
    try {
        const result = await BrandService.createBrand(req.body);
         res.status(201).json({success:true,message:"Brand created successfully",data:result})
    } catch (error) {
        res.status(500).json({success:false,message:"Internal server error",error})
    }
};

const brandFetch = async(req:Request,res:Response) => {
    try {
        const result = await BrandService.brandFetch();
         res.status(200).json({success:true,message:"Brand fetched successfully",data:result})
    } catch (error) {
        res.status(500).json({success:false,message:"Internal server error",error})
    }
};

const brandDelete = async(req:Request,res:Response) => {
    try{
        const {id} = req.params;
        console.log("id",id)
        const result = await BrandService.brandDelete(id as string);
         res.status(200).json({success:true,message:"Brand Delete successfully",data:result})
    } catch (error) {
        res.status(500).json({success:false,message:"Internal server error",error})
    }
}


const brandUpdate = async(req:Request,res:Response) => {
    try{
        const {id} = req.params;
        const payload = req.body;
        const result = await BrandService.brandUpdate(id as string,payload);
         res.status(200).json({success:true,message:"Brand Update successfully",data:result})
    } catch (error) {
        res.status(500).json({success:false,message:"Internal server error",error})
    }
}


export const BrandController = {brandCreate,brandFetch,brandDelete,brandUpdate}