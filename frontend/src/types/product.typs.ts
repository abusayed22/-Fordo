


export interface IProductResponse {
    title: string,
    categoryId: string,
    brandId: string,
    description: string,
    costPrice: number,
    originalPrice: number,
    sellingPrice: number,
    stock: number,
    unitType: string,
    unitValue: number,
    isDiscounted: boolean,
    discountType: string,
    // discountValue?: number,
    // supplierName?: string,
    // invoiceNo?: string,
    isAvailable: boolean,
    images?: string[],
}

export type ProductUnit = "PIECE" | "KG" | "GM" | "LITER" | "ML" | "PACK" | "BOX" | "DOZEN" | "METER";
export type DiscountType = "PERCENTAGE" | "FLAT";

