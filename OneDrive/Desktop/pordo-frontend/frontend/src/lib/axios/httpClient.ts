import axios from "axios";



const API_Base_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
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


const httpGet = async (endpoint: string, options?: ApiRequestOptions) => {
    try {
        const response = await (await axiosInstance()).get(endpoint, {
            params: options?.params,
            headers: options?.headers,
        });
        return response.data;
    } catch (error: any) {
        console.error(`GET request to ${endpoint} failed:`, error);
        throw error;
    }
};


const httpPost = async (endpoint: string, data: unknown, options?: ApiRequestOptions) => {
    try {
        const response = await (await axiosInstance()).post(endpoint, data, {
            params: options?.params,
            headers: options?.headers,
        });
        return response.data;
    } catch (error: any) {
        console.error(`POST request to ${endpoint} failed:`, error);
        throw error;
    }
};



const httpPatch = async (endpoint: string, data: unknown, options?: ApiRequestOptions) => {
    try {
        const response = await (await axiosInstance()).patch(endpoint, data, {
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

const httpDelete = async (endpoint: string, options?: ApiRequestOptions) => {
    try {
        const response = await (await axiosInstance()).delete(endpoint, {
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

