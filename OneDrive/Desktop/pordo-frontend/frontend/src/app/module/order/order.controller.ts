/* eslint-disable @typescript-eslint/no-explicit-any */
import { StatusCodes } from "http-status-codes";
import sendResponse from "../../shared/sendResponse";
import { OrderService } from "./order.service";
import { ICreateOrderPayload } from "./order.interface";
import { Request, Response } from "express";


type OrderRequest = Request & ICreateOrderPayload

const createOrder = async (req: OrderRequest, res: Response) => {
  try {
    const {userId} = req.body.userId;
    
    const createdById = (req as any).user?.id;

    const payload = {
      ...req.body,https:
      userId,
      createdById,
    };

    const result = await OrderService.createOrder(payload as any);

    sendResponse(res,{success:true,message:"Order placed successfully",data:result,statusCode:StatusCodes.OK});
    
  } catch (error: any) {
    sendResponse(res,{success:false,message:error.message || "Failed to place order",statusCode:StatusCodes.BAD_REQUEST});
  }
};


const getSingleOrder = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const result = await OrderService.getSingleOrder(req.params.id as string, user?.id, user?.role);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return res.status(404).json({
      success: false,
      message: error.message || "Order not found",
    });
  }
};


const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const result = await OrderService.updateOrderStatus(req.params.id as string, req.body);

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to update order",
    });
  }
};



export const OrderController = {createOrder,getSingleOrder,updateOrderStatus};