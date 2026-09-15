import { OrderStatus, PaymentStatus, PaymentGateway } from "../../../generated/prisma/enums";

export interface IOrderItemPayload {
  productId: string;
  quantity: number;
}

export interface ICreateOrderPayload {
  addressId: string;
  deliveryFee?: number;
  discountAmount?: number;
  paymentMethod?: PaymentGateway;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  shippingAddress?: string;
  note?: string;
  items: IOrderItemPayload[];
}

export interface IOrderQueryParams {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  search?: string;
}

