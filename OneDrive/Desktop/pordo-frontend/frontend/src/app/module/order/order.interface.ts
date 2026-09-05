import { PaymentGateway } from "../../../generated/prisma/enums";

export interface ICreateOrderPayload {
  userId: string;
  createdById?: string;
  addressId: string;
  items: { productId: string; quantity: number }[];
  deliveryFee?: number;
  discountAmount?: number;
  paymentMethod?: PaymentGateway;
  note?: string;
  deliveryDate?: Date;
  isManual?: boolean;
}


