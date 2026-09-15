"use server";

import { httpClient } from "@/lib/axios/httpClient";
import type { ApiResponse } from "@/types/api.response";
import { ICreateOrderResponseData, OrdersListResponse, OrdersQueryParams } from "@/types/order.types";
import { createOrderSchema, type CreateOrderPayload } from "@/zodValidation/order.validation";



export async function createOrderAction(
  payload: CreateOrderPayload,
): Promise<ApiResponse<ICreateOrderResponseData>> {
  const parsedPayload = createOrderSchema.safeParse(payload);
  console.log(parsedPayload)

  if (!parsedPayload.success) {
    return {
      success: false,
      message: parsedPayload.error.issues[0]?.message || "Invalid order details",
      data: null,
    };
  }

  try {
    const response = await httpClient.post<ApiResponse<ICreateOrderResponseData>>(
      "/order",
      parsedPayload.data,
    );

    // console.log("response" ,response)
    return response.data;
  } catch (error: unknown) {
    const message =
      error && typeof error === "object" && "response" in error
        ? ((error as { response?: { data?: { message?: string } } }).response?.data?.message)
        : undefined;

    return {
      success: false,
      message: message || "Unable to create the order. Please try again.",
      data: null,
    };
  }
}



export async function getOrdersData(params: OrdersQueryParams) {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.status && params.status !== "All") query.set("status", params.status);
  if (params.search) query.set("search", params.search);

  const res = await httpClient.get<OrdersListResponse>(`/order?${query.toString()}`);
  console.log("Order " ,res)
  return (res as any)?.data?.data !== undefined ? (res as any).data : res;
}

export async function updateOrderStatusAction(payload: { orderId: string; status: string }) {
  const res = await httpClient.patch(`/orders/${payload.orderId}/status`, { status: payload.status });
  return (res as any)?.data !== undefined ? (res as any).data : res;
}


