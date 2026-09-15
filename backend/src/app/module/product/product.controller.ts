import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ProductService } from './product.service';
import sendResponse from '../../shared/sendResponse';
import { ICreateProductPayload } from './product.interface';

export const createProduct = async (req: Request, res: Response) => {
  // try {
    const files = Array.isArray(req.files) ? req.files : [];
    const imageUrls = files
      ?.map((file) => file.path)
      .filter((path): path is string => Boolean(path)) || [];

    // const payload = {
    //   title: req.body.title,
    //   categoryId: req.body.categoryId,
    //   brandId: req.body.brandId || undefined,
    //   description: req.body.description || undefined,
    //   costPrice: Number(req.body.costPrice),
    //   originalPrice: Number(req.body.originalPrice),
    //   sellingPrice: Number(req.body.sellingPrice),
    //   stock: Number(req.body.stock),
    //   unitType: req.body.unitType,
    //   createdById: req.body.createdById,
    //   unitValue: req.body.unitValue ? Number(req.body.unitValue) : undefined,
    //   supplierName: req.body.supplierName || undefined,
    //   invoiceNo: req.body.invoiceNo || undefined,
    //   images: imageUrls,
    // };

    const payload: ICreateProductPayload & { createdById: string } = {
      title: req.body.title?.trim(),
      categoryId: req.body.categoryId,
      brandId: req.body.brandId || undefined,
      description: req.body.description?.trim() || undefined,
      
      // সংখ্যা কনভার্সন
      costPrice: Number(req.body.costPrice),
      originalPrice: Number(req.body.originalPrice),
      sellingPrice: Number(req.body.sellingPrice),
      stock: Number(req.body.stock),
      unitValue: req.body.unitValue ? Number(req.body.unitValue) : undefined,
      
      // এনাম ও একক
      unitType: req.body.unitType,
      
      // ডিসকাউন্ট ফিল্ড হ্যান্ডলিং (form-data তে boolean স্ট্রিং হিসেবে আসে)
      isDiscounted: req.body.isDiscounted === "true" || req.body.isDiscounted === true,
      discountType: req.body.discountType || undefined,
      discountValue: req.body.discountValue ? Number(req.body.discountValue) : undefined,
      discountExpires: req.body.discountExpires ? new Date(req.body.discountExpires) : undefined,
      
      // সাপ্লায়ার ও ট্র্যাকিং মেটা
      supplierName: req.body.supplierName?.trim() || undefined,
      invoiceNo: req.body.invoiceNo?.trim() || undefined,
      isAvailable: req.body.isAvailable !== undefined ? req.body.isAvailable === "true" || req.body.isAvailable === true : true,
      
      // অডিটের জন্য ইউজার আইডি (authMiddleware থেকে নেওয়া সবচেয়ে নিরাপদ)
      createdById: (req as any).user?.id || req.body.createdById,
      
      images: imageUrls,
    };

    const result = await ProductService.productCreate(payload as ICreateProductPayload);
    sendResponse(res,{success:true,message:"Product and initial purchase record created successfully",data:result,statusCode:StatusCodes.OK});
    
  }

  export const getAllProducts = async (req:Request, res:Response) => {
    const result = await ProductService.getAllProducts();
  
    sendResponse(res,{success:true,message:"Products fetched successfully",data:result,statusCode:StatusCodes.OK});
    
  // } catch (error) {
    // return res.status(500).json({
    //   success: false,
    //   statusCode: 500,
    //   message: error.message || "Failed to fetch products",
    // });
  // }
};



const stockInProduct = async (req: Request, res: Response) => {
  try {
    const { productId, quantity, unitCost, newSellingPrice, supplierName, invoiceNo } = req.body;

    if (!productId || quantity === undefined || unitCost === undefined) {
      sendResponse(res,{success:false,message:"productId, quantity, and unitCost are required fields.",statusCode:StatusCodes.BAD_REQUEST});
      return;
    }

    const payload = {
      productId,
      quantity: Number(quantity),
      unitCost: Number(unitCost),
      newSellingPrice: newSellingPrice ? Number(newSellingPrice) : undefined,
      supplierName: supplierName || undefined,
      invoiceNo: invoiceNo || undefined,
    };

    const result = await ProductService.productUpdateStock(payload);

    sendResponse(res,{success:false,message:"Stock incremented, cost price recalculated, and purchase recorded successfully.",data:result,statusCode:StatusCodes.OK});
  
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
     sendResponse(res,{success:false,message:error.message || "Failed to update product stock",statusCode:StatusCodes.BAD_REQUEST});
  }
};

// TODO: sendResponse hobe
 const getSingleProduct = async (req: Request, res: Response) => {
  try {
    const result = await ProductService.getProductById(req.params.id as string);
    sendResponse(res,{success:true,message:"Product fetched successfully",data:result,statusCode:StatusCodes.OK});
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    sendResponse(res,{success:false,message:error.message,statusCode:StatusCodes.BAD_REQUEST});
  }
};


 const updateProduct = async (req: Request, res: Response) => {
  try {
    const result = await ProductService.updateProductDetails(req.params.id as string, req.body);
    sendResponse(res,{success:true,message:"Product updated successfully",data:result,statusCode:StatusCodes.OK});
    
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    sendResponse(res,{success:false,message:error.message || "Failed to update product",statusCode:StatusCodes.BAD_REQUEST});
  }
};



 const deleteProduct = async (req: Request, res: Response) => {
  try {
    const result = await ProductService.deleteProduct(req.params.id as string);
    sendResponse(res,{success:true,message:"Product and initial purchase record created successfully",data:result,statusCode:StatusCodes.OK});
    
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    sendResponse(res,{success:false,message:error.message || "Failed to delete product",statusCode:StatusCodes.BAD_REQUEST});
  }
};




export const ProductController = { createProduct,getAllProducts, stockInProduct,getSingleProduct,updateProduct,deleteProduct };
