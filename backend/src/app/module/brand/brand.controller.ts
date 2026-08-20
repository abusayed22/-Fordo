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


export const BrandController = {brandCreate,brandFetch}