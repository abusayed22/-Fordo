


export interface IProductResponse {
  id?: string,
  sku?: string,
    title: string,
    categoryId: string,
    brandId: string,
    brandName?: string,
    categoryName?: string,
    brandLogo?: string,
    brandImage?: string,
    brand?: { name?: string; logo?: string; image?: string } | string,
    category?: { name?: string } | string,
    description: string,
    costPrice: number,
    originalPrice: number,
    sellingPrice: number,
    stock: number,
    unitType: string,
    unitValue: number,
    isDiscounted: boolean,
    discountType: string,
    discountValue?: number,
    supplierName?: string,
    invoiceNo?: string,
    isAvailable: boolean,
    images?: Array<string | { url?: string }>,
}

 export interface ProductQueryParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  categoryId?: string;
  brandId?: string;
  minPrice?: number;
  maxPrice?: number;
  isAvailable?: boolean;
}


  
export type ProductUnit = "PIECE" | "KG" | "GM" |"MG"| "LITER" | "ML" | "PACKET" | "BOX" | "DOZEN" |"PAIR"|"BUNDLE"|"BAG"|"BOTTLE"|"CAN";
export type DiscountType = "PERCENTAGE" |"FIXED_AMOUNT";

