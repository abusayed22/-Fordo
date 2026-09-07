

export interface ApiResponse<TData = unknown> {
    success: boolean;
    message: string;
    data: TData;
    meta?: MetaData;
}

export interface MetaData {
        page:number;
        limit:number;
        total:number;
    }


export interface ApiErrorResponse {
    success: false;
    message: string;
}
