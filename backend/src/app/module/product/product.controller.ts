import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ProductService } from './product.service';
import sendResponse from '../../shared/sendResponse';

type UploadedFile = {
  path?: string;
};

type ProductRequest = Request & {
  files?: UploadedFile[];
};

export const createProduct = async (req: ProductRequest, res: Response) => {
  try {
    const files = req.files;
    const imageUrls = files
      ?.map((file) => file.path)
      .filter((path): path is string => Boolean(path)) || [];

    const payload = {
      title: req.body.title,
      categoryId: req.body.categoryId,
      brandId: req.body.brandId || undefined,
      description: req.body.description || undefined,
      costPrice: Number(req.body.costPrice),
      originalPrice: Number(req.body.originalPrice),
      sellingPrice: Number(req.body.sellingPrice),
      stock: Number(req.body.stock),
      unit: req.body.unit,
      unitValue: req.body.unitValue ? Number(req.body.unitValue) : undefined,
      supplierName: req.body.supplierName || undefined,
      invoiceNo: req.body.invoiceNo || undefined,
      images: imageUrls,
    };

    const result = await ProductService.productCreate(payload);
    sendResponse(res,{success:true,message:"Product and initial purchase record created successfully",data:result,statusCode:StatusCodes.OK});
    
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    sendResponse(res,{success:false,message:error.message || "Failed to create product",statusCode:StatusCodes.BAD_REQUEST});
  }
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




export const ProductController = { createProduct, stockInProduct,getSingleProduct,updateProduct,deleteProduct };
