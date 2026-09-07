"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { cookieUtils } from "@/lib/cookieUtils";
import { setTokenInCookie } from "@/lib/tokenUtils";
import { ApiErrorResponse, ApiResponse } from "@/types/api.response";
import { ILoginResponse } from "@/types/auth";
import { ILoginPayload, loginZodSchema } from "@/zodValidation/auth.validation";
import { redirect } from "next/navigation";


export const loginAction = async (payload: ILoginPayload): Promise<ApiResponse | ApiErrorResponse> => {
    const parsedPayload = loginZodSchema.safeParse(payload);
    if (!parsedPayload.success) {
        const firstError = parsedPayload.error.issues[0];
        return {
            success: false,
            message: firstError.message,
        }
    }
    try {
        const response = await httpClient.post<ILoginResponse>("/auth/login", parsedPayload.data);
        const { accessToken, refreshToken, token, user } = response.data;

        await setTokenInCookie("accessToken", accessToken);
        await setTokenInCookie("refreshToken", refreshToken);
        await setTokenInCookie("better-auth.session_token", token, 24 * 60 * 60);

        // TODO: wish role based redirection can be implemented here in the future
        redirect("/dashboard")

    } catch (error: any) {
        if (error && typeof error === "object" && "digest" in error && typeof error.digest === "string" && error.digest.startsWith("NEXT_REDIRECT")) {
            throw error;
        }
        return {
            success: false,
            message: error.message || "An error occurred during login",
        }
    }
}
