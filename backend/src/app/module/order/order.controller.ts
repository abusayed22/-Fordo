import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { OrderService } from "./order.service";

const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req.user).userId;
    const result = await OrderService.createOrder(req.body, userId);

    res.status(StatusCodes.CREATED).json({
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Order placed successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    const result = await OrderService.getOrders(req.query, user);

    res.status(StatusCodes.OK).json({
      success: true,
      statusCode: StatusCodes.OK,
      message: "Orders retrieved successfully",
      meta: result.meta,
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
};

const getSingleOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const user = req.user ;
    const result = await OrderService.getSingleOrder(String(id), user);

    res.status(StatusCodes.OK).json({
      success: true,
      statusCode: StatusCodes.OK,
      message: "Order details fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const result = await OrderService.updateOrderStatus(String(id), status);

    res.status(StatusCodes.OK).json({
      success: true,
      statusCode: StatusCodes.OK,
      message: "Order status updated successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const OrderController = {
  createOrder,
  getOrders,
  getSingleOrder,
  updateOrderStatus,
};