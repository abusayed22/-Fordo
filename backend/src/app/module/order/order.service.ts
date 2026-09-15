import { prisma } from "../../lib/prisma";
import { ICreateOrderPayload, IOrderQueryParams } from "./order.interface";
// import AppError from "../errorHelper/AppError";
import { StatusCodes } from "http-status-codes";
import { OrderStatus, UserRole } from "../../../generated/prisma/enums";
import AppError from "../../errorHelper/AppError";

const createOrder = async (payload: ICreateOrderPayload, userId: string) => {
  const { items,addressId, deliveryFee = 0, discountAmount = 0, ...orderMeta } = payload;

  return await prisma.$transaction(async (tx) => {
    // ১. অর্ডার নম্বর তৈরি (যেমন: ORD-1726400000000)
    const orderNumber = `ORD-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;

    let validAddressId: string | null = null;
    if (addressId && addressId !== "manual-counter-pos-id") {
      const existingAddress = await tx.address.findUnique({
        where: { id: addressId },
      });
      if (existingAddress) {
        validAddressId = existingAddress.id;
      }
    }

    let calculatedSubTotal = 0;
    const orderItemsData = [];

    // ২. প্রতিটি প্রোডাক্টের বর্তমান স্টক ও দাম ভ্যালিডেশন
    for (const item of items) {
      const product = await tx.product.findUnique({
        where: { id: item.productId, isDeleted: false },
      });

      if (!product) {
        throw new AppError(StatusCodes.NOT_FOUND, `Product not found: ${item.productId}`);
      }

      if (!product.isAvailable) {
        throw new AppError(StatusCodes.BAD_REQUEST, `Product is currently unavailable: ${product.title}`);
      }

      if (product.stock < item.quantity) {
        throw new AppError(
          StatusCodes.BAD_REQUEST,
          `Insufficient stock for "${product.title}". Available: ${product.stock}, Requested: ${item.quantity}`
        );
      }

      // দাম নির্ধারণ (যদি ডিসকাউন্ট প্রাইস থাকে সেটা নিবে, না থাকলে regularPrice)
      const currentPrice = (product.isDiscounted && product.sellingPrice > 0)
        ? product.sellingPrice 
        : product.originalPrice;

      const itemTotal = currentPrice * item.quantity;
      calculatedSubTotal += itemTotal;

      orderItemsData.push({
        productId: product.id,
        quantity: item.quantity,
        costPrice: product.costPrice,
        unitPrice: currentPrice,
        totalPrice: itemTotal,
      });

      // ৩. স্টক মাইনাস করা (Atomic decrement)
      await tx.product.update({
        where: { id: product.id },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }

    const finalTotalAmount = Math.max(0, calculatedSubTotal + deliveryFee - discountAmount);

    // ৪. অর্ডার এবং অর্ডার আইটেম ডাটাবেসে সেভ
    const newOrder = await tx.order.create({
      data: {
        orderNumber,
        addressId: validAddressId,
        userId,
        subTotal: calculatedSubTotal,
        deliveryFee,
        discountAmount,
        totalAmount: finalTotalAmount,
        ...orderMeta,
        orderItems: {
          create: orderItemsData,
        },
      },
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                title: true,
                slug: true,
              },
            },
          },
        },
        address: true,
      },
    });

    return newOrder;
  });
};

const getOrders = async (queryParams: IOrderQueryParams, user: { userId: string; role: UserRole }) => {
  const { page = 1, limit = 10, status, paymentStatus, search } = queryParams;
  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  // কাস্টমার হলে শুধু তার নিজের অর্ডার দেখবে, অ্যাডমিন/ম্যানেজার হলে সবার অর্ডার দেখতে পারবে
  const where: any = {
    ...(user.role === UserRole.CUSTOMER ? { userId: user.userId } : {}),
    ...(status ? { status } : {}),
    ...(paymentStatus ? { paymentStatus } : {}),
    ...(search
      ? {
          OR: [
            { orderNumber: { contains: search, mode: "insensitive" } },
            { customerPhone: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [orders, total] = await prisma.$transaction([
    prisma.order.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: "desc" },
      include: {
        orderItems: {
          include: {
            product: {
              select: { id: true, title: true, images: { take: 1 } },
            },
          },
        },
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    }),
    prisma.order.count({ where }),
  ]);

  return {
    meta: {
      page: Number(page),
      limit: take,
      total,
      totalPages: Math.ceil(total / take),
    },
    data: orders,
  };
};

const getSingleOrder = async (orderId: string, user: { userId: string; role: UserRole }) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
      address: true,
      user: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  if (!order) {
    throw new AppError(StatusCodes.NOT_FOUND, "Order not found");
  }

  // কাস্টমার অন্য কারো অর্ডার দেখার চেষ্টা করলে ব্লক
  if (user.role === UserRole.CUSTOMER && order.userId !== user.userId) {
    throw new AppError(StatusCodes.FORBIDDEN, "Forbidden access to this order");
  }

  return order;
};

const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
  return await prisma.$transaction(async (tx) => {
    const existingOrder = await tx.order.findUnique({
      where: { id: orderId },
      include: { orderItems: true },
    });

    if (!existingOrder) {
      throw new AppError(StatusCodes.NOT_FOUND, "Order not found");
    }

    // অর্ডার ক্যানসেল হলে স্টক আবার ফেরত (Increment) দেওয়ার লজিক
    if (status === OrderStatus.CANCELLED && existingOrder.status !== OrderStatus.CANCELLED) {
      for (const item of existingOrder.orderItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              increment: item.quantity,
            },
          },
        });
      }
    }

    return await tx.order.update({
      where: { id: orderId },
      data: { status },
    });
  });
};

export const OrderService = {
  createOrder,
  getOrders,
  getSingleOrder,
  updateOrderStatus,
};