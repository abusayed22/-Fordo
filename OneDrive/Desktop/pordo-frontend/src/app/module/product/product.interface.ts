import { DiscountType, ProductUnit } from "../../../generated/prisma/enums";



export interface ICreateProductPayload {
  vendorId?: string;
  categoryId: string;
  brandId?: string;
  title: string;
  slug?: string;
  description?: string;
  costPrice: number;
  originalPrice: number;
  sellingPrice: number;
  stock: number;
  unit: ProductUnit;
  unitValue?: number;
  isDiscounted?: boolean;
  discountType?: DiscountType;
  discountValue?: number;
  discountExpires?: Date;
  isAvailable?: boolean;
  images?: string[];
  supplierName?: string;
  invoiceNo?:string
}


export interface IUpdateProductPayload {
  productId: string;
  quantity: number;        // নতুন কেনা পরিমাণ (incoming stock)
  unitCost: number;        // প্রতি ইউনিটের নতুন কেনা দাম (incoming cost price)
  newSellingPrice?: number; // নতুন বিক্রয়মূল্য (ঐচ্ছিক)
  supplierName?: string;
  invoiceNo?: string;
}