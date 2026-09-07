import { ApiResponse } from "@/types/api.response";
import axios from "axios";



const API_Base_URL = process.env.API_BASE_URL || 'http://localhost:5000/api/v1';
if (!API_Base_URL) {
    throw new Error('API Base URL is not defined. Please set NEXT_PUBLIC_API_BASE_URL in your environment variables.');
}


const axiosInstance = async () => {
    const instance = axios.create({
        baseURL: API_Base_URL,
        timeout: 30000,
        headers: {
            'Content-Type': 'application/json',
        },
    })

    return instance;
};


export interface ApiRequestOptions {
    params?: Record<string, any>,
    headers?: Record<string, string>,

};


const httpGet = async<TData> (endpoint: string, options?: ApiRequestOptions):Promise<ApiResponse<TData>> => {
    try {
        const response = await (await axiosInstance()).get<ApiResponse<TData>>(endpoint, {
            params: options?.params,
            headers: options?.headers,
        });
        return response.data;
    } catch (error: any) {
        console.error(`GET request to ${endpoint} failed:`, error);
        throw error;
    }
};


const httpPost = async <TData>(endpoint: string, data: unknown, options?: ApiRequestOptions):Promise<ApiResponse<TData>> => {
    try {
        const response = await (await axiosInstance()).post<ApiResponse<TData>>(endpoint, data, {
            params: options?.params,
            headers: options?.headers,
        });
        return response.data;
    } catch (error: any) {
        console.error(`POST request to ${endpoint} failed:`, error);
        throw error;
    }
};

const httpPut = async <TData>(endpoint: string, data: unknown, options?: ApiRequestOptions):Promise<ApiResponse<TData>> => {
    try {
        const response = await (await axiosInstance()).put<ApiResponse<TData>>(endpoint, data, {
            params: options?.params,
            headers: options?.headers,
        });
        return response.data;
    } catch (error) {
        console.error(`PUT request to ${endpoint} failed:`, error);
        throw error;
    }
}


const httpPatch = async <TData> (endpoint: string, data: unknown, options?: ApiRequestOptions):Promise<ApiResponse<TData>> => {
    try {
        const response = await (await axiosInstance()).patch <ApiResponse<TData>> (endpoint, data, {
            params: options?.params,
            headers: options?.headers,
        });
        return response.data;
    }
    catch (error) {
        console.error(`PATCH request to ${endpoint} failed:`, error);
        throw error;
    }
}

const httpDelete = async <TData>(endpoint: string, options?: ApiRequestOptions):Promise<ApiResponse<TData>> => {
    try {
        const response = await (await axiosInstance()).delete <ApiResponse<TData>>(endpoint, {
            params: options?.params,
            headers: options?.headers,
        });
        return response.data;
    } catch (error) {
        console.error(`DELETE request to ${endpoint} failed:`, error);
        throw error;
    }
};



export const httpClient = {
    get: httpGet,
    post: httpPost,
    put: httpPatch, 
    patch: httpPatch,
    delete: httpDelete,
}

