"use server";

import { httpClient } from "@/lib/axios/httpClient";
import {  productCreateZodSchema } from "@/zodValidation/product.validation";
import { getUserInfo } from "./auth.service";
import { ApiErrorResponse, ApiResponse } from "@/types/api.response";
import { IProductResponse, ProductQueryParams } from "@/types/product.typs";

interface ProductListPayload {
  meta: {
    total: number;
  };
  data: IProductResponse[];
}


export async function getProductsData(
  params?: ProductQueryParams,
): Promise<ApiResponse<ProductListPayload>> {
  try {
    const searchParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          searchParams.append(key, String(value));
        }
      });
    }

    // const queryString = searchParams.toString();
    // const endpoint = queryString ? `/product?${queryString}` : "/product";
    // const endpoint = "/product";

    const queryString = searchParams.toString();
    const endpoint = queryString ? `/product?${queryString}` : "/product";
    const response = await httpClient.get<ProductListPayload>(endpoint);

    return response;
  } catch (error: any) {
    console.error("Product Fetch Server Action Error:", error);
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error?.message ||
        "An error occurred while fetching product data.",
      data: { meta: { total: 0 }, data: [] },
    };
  }
}


export const createProductAction = async (payload: FormData): Promise<ApiResponse | ApiErrorResponse> => {
    const userInfo = await getUserInfo()
    if (!userInfo) {
        return {
            success: false,
            message: "Unauthorized: You must be logged in to create a product",
        };
    }
    console.log("user id", userInfo.id);
    const rawData = payload.get("data");
    const file = payload.get("file");
    if (typeof rawData !== "string" || !(file instanceof File)) {
        return { success: false, message: "Product details and an image are required" };
    }

    let productData: unknown;
    try {
        productData = JSON.parse(rawData);
    } catch {
        return { success: false, message: "Invalid product details" };
    }

    const parsedPayload = productCreateZodSchema.safeParse({
      ...(productData as Record<string, unknown>),
      file,
    });
    if (!parsedPayload.success) {
        const firstError = parsedPayload.error.issues[0];
        return {
            success: false,
            message: firstError.message,
        }
    }
    const { file: _file, ...productDetails } = parsedPayload.data;
    const requestData = {
      ...productDetails,
        createdById: userInfo.id,
    };
    try {
        const requestDataForm = new FormData();
        requestDataForm.append("data", JSON.stringify(requestData));
        requestDataForm.append("file", file);
        const response = await httpClient.post<IProductResponse>("/product", requestDataForm, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        console.log("Product create response", response);
        return {
            success: true,
            message: "Product created successfully",
            data: response.data
        }


    } catch (error: any) {
        if (error && typeof error === "object" && "digest" in error && typeof error.digest === "string" && error.digest.startsWith("NEXT_REDIRECT")) {
            throw error;
        }
        return {
            success: false,
            message: error.message || "An error occurred during product creation",
        }
    }
}


export const categoryUpdate = async(formData: FormData) => {
  try{
    const rawData = formData.get("data") as string;
    const data = JSON.parse(rawData);
    return await httpClient.patch(`/category/${data.id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

  }catch(error: any){
    process.env.NODE_ENV === "development" && console.log(error, "Category Update Server Action");
    return {
      success: false,
      message: error.message || "An error occurred while updating the category.",
      data: null,
      meta: null,
    };
  }
}

export const categoryDelete = async(id: string) => {
  try{
    return await httpClient.delete(`/category/${id}`, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

  }catch(error: any){
    process.env.NODE_ENV === "development" && console.log(error, "Category Delete Server Action");
    return {
      success: false,
      message: error.message || "An error occurred while delete the category.",
      data: null,
      meta: null,
    };
  }
}


