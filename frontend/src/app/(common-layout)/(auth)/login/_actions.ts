"use server";

import { getDefaultDashboardRoute, isValidRedirectForRole, UserRole } from "@/lib/authUtils";
import { httpClient } from "@/lib/axios/httpClient";
import { cookieUtils } from "@/lib/cookieUtils";
import { setTokenInCookie } from "@/lib/tokenUtils";
import { ApiErrorResponse, ApiResponse } from "@/types/api.response";
import { ILoginResponse } from "@/types/auth";
import { ILoginPayload, loginZodSchema } from "@/zodValidation/auth.validation";
import { redirect } from "next/navigation";


export const loginAction = async (payload: ILoginPayload, redirectPath?: string): Promise<ApiResponse | ApiErrorResponse> => {
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
        const data = response.data
        if (!data) {
            return {
                success: false,
                message: "No login data received from server",
            };
        }
        const { accessToken, refreshToken, token, user } = data;
        const { role, emailVerified, needPasswordChange, email } = user;

        await setTokenInCookie("accessToken", accessToken);
        await setTokenInCookie("refreshToken", refreshToken);
        await setTokenInCookie("better-auth.session_token", token, 24 * 60 * 60);


        if (needPasswordChange) {
            //TODO: refactoring
            redirect(`/reset-password?email=${email}`);
        } else {
            // redirect(redirectPath || "/dashboard");
            const targetPath = redirectPath && isValidRedirectForRole(redirectPath, role as UserRole) ? redirectPath : getDefaultDashboardRoute(role as UserRole);


            redirect(targetPath);
        }

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
