import { OrderStatus, PaymentGateway, PaymentStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { generateOrderNumber } from "../../utils/orderGenerate";
import { ICreateOrderPayload } from "./order.interface";



const createOrder = async (payload: ICreateOrderPayload) => {
    const {
        userId,
        createdById,
        addressId,
        items,
        deliveryFee = 0,
        discountAmount = 0,
        paymentMethod = PaymentGateway.COD,
        note,
        deliveryDate,
        isManual = false,
    } = payload;

    const productIds = items.map((item) => item.productId);

    return await prisma.$transaction(async (tx) => {

        const dbProducts = await tx.product.findMany({
            where: {
                id: { in: productIds },
                isDeleted: false,
            },
        });

        if (dbProducts.length !== items.length) {
            throw new Error("One or more selected products were not found or deleted");
        }

        const productMap = new Map(dbProducts.map((p) => [p.id, p]));

        let subTotal = 0;
        const orderItemsData: {
            productId: string;
            quantity: number;
            costPrice: number;
            unitPrice: number;
            totalPrice: number;
        }[] = [];

        // ২. স্টক ভ্যালিডেশন এবং হিসেব নিরূপণ
        for (const item of items) {
            const product = productMap.get(item.productId)!;

            if (!product.isAvailable || product.stock < item.quantity) {
                throw new Error(
                    `Insufficient stock for "${product.title}". Available: ${product.stock}, Requested: ${item.quantity}`
                );
            }

            const unitPrice = product.sellingPrice;
            const costPrice = product.costPrice; // পারফেক্ট প্রফিট অ্যানালাইসিসের জন্য বর্তমান WAC সংরক্ষণ
            const totalPrice = Number((item.quantity * unitPrice).toFixed(2));

            subTotal += totalPrice;

            orderItemsData.push({
                productId: product.id,
                quantity: item.quantity,
                costPrice,
                unitPrice,
                totalPrice,
            });

            // ৩. স্টক মাইনাস করা
            const remainingStock = product.stock - item.quantity;
            await tx.product.update({
                where: { id: product.id },
                data: {
                    stock: remainingStock,
                    isAvailable: remainingStock > 0,
                },
            });
        }

        subTotal = Number(subTotal.toFixed(2));
        const totalAmount = Number((subTotal + deliveryFee - discountAmount).toFixed(2));

        let orderNumber = generateOrderNumber();
        let isUnique = false;

        while (!isUnique) {
            const existing = await tx.order.findUnique({ where: { orderNumber } });
            if (!existing) {
                isUnique = true;
            } else {
                orderNumber = generateOrderNumber();
            }
        }

        // ৪. অর্ডার তৈরি ও আইটেমস যুক্ত করা
        return await tx.order.create({
            data: {
                orderNumber,
                userId,
                createdById: isManual ? createdById : null,
                addressId,
                subTotal,
                deliveryFee,
                discountAmount,
                totalAmount,
                paymentMethod,
                note,
                deliveryDate,
                isManual,
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
                                unit: true,
                                images: { take: 1, select: { url: true } },
                            },
                        },
                    },
                },
                address: true,
            },
        });
    });
};

const getSingleOrder = async (id: string, currentUserId?: string, userRole?: string) => {
    const order = await prisma.order.findUnique({
        where: { id },
        include: {
            user: { select: { id: true, name: true, phone: true } },
            address: true,
            orderItems: {
                include: {
                    product: {
                        select: { id: true, title: true, unit: true, images: true },
                    },
                },
            },
        },
    });

    if (!order) throw new Error("Order not found");

    if (userRole === "CUSTOMER" && order.userId !== currentUserId) {
        throw new Error("You are not authorized to view this order");
    }

    return order;
};


const updateOrderStatus = async (
    id: string,
    payload: {
        status?: OrderStatus;
        paymentStatus?: PaymentStatus;
        deliveryDate?: Date;
        note?: string;
    }
    ) => {
    const existingOrder = await prisma.order.findUnique({
        where: { id },
        include: { orderItems: true },
    });

    if (!existingOrder) throw new Error("Order not found");

    // যদি অর্ডার ক্যান্সেল করা হয়, তবে স্টক ফেরত দেওয়া (Restock)
    if (
        payload.status === OrderStatus.CANCELLED &&
        existingOrder.status !== OrderStatus.CANCELLED
    ) {
        return await prisma.$transaction(async (tx) => {
            for (const item of existingOrder.orderItems) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: {
                        stock: { increment: item.quantity },
                        isAvailable: true,
                    },
                });
            }

            return await tx.order.update({
                where: { id },
                data: payload,
            });
        });
    }

    return await prisma.order.update({
        where: { id },
        data: payload,
    });
};





export const OrderService = { createOrder, getSingleOrder, updateOrderStatus, }