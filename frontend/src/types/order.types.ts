


export type OrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export type PaymentGateway = "COD" | "BKASH" | "NAGAD" | "SSLCOMMERZ";


export interface ICreatedOrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  costPrice: number;
  unitPrice: number;
  totalPrice: number;
  createdAt: string | Date;
  product?: {
    id: string;
    title: string;
    slug: string;
  };
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  data?: null;
  errorMessages?: Array<{ path: string | number; message: string }>;
  stack?: string;
}


export interface ICreateOrderResponseData {
  id: string;
  orderNumber: string;
  userId: string;
  addressId: string;
  subTotal: number;
  deliveryFee: number;
  discountAmount: number;
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentGateway;
  customerName: string | null;
  customerPhone: string | null;
  customerEmail: string | null;
  shippingAddress: string | null;
  note: string | null;
  deliveryDate: string | Date | null;
  isManual: boolean;
  createdById: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
  orderItems: ICreatedOrderItem[];
}


export interface OrdersListResponse {
  success: boolean;
  message: string;
  data: ICreateOrderResponseData[];
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface OrdersQueryParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}

