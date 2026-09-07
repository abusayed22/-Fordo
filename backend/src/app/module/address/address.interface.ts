

export interface ICreateAddressPayload {
  userId: string;
  deliveryZoneId: string;
  addressLine: string;
  contactPhone: string;
  isDefault?: boolean;
}

export interface IUpdateAddressPayload {
  deliveryZoneId?: string;
  addressLine?: string;
  contactPhone?: string;
  isDefault?: boolean;
}