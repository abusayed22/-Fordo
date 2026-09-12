import { httpClient } from "@/lib/axios/httpClient";
import { getUserInfo } from "@/services/auth.service";
import { ApiErrorResponse, ApiResponse } from "@/types/api.response";
import { IProductResponse } from "@/types/product.typs";
import { IProductCreateFormData, productCreateZodSchema } from "@/zodValidation/product.validation";



export const createProductAction = async (payload: FormData): Promise<ApiResponse | ApiErrorResponse> => {
    const userInfo = await getUserInfo()
    if (!userInfo) {
        return {
            success: false,
            message: "Unauthorized: You must be logged in to create a product",
        };
    }
    const parsedPayload = productCreateZodSchema.safeParse(payload);
    if (!parsedPayload.success) {
        const firstError = parsedPayload.error.issues[0];
        return {
            success: false,
            message: firstError.message,
        }
    }
    const requestData = {
        ...parsedPayload.data,
        createdById: userInfo.id,
    };
    try {
        const response = await httpClient.post<IProductResponse>("/product", requestData);
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


