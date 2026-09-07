import { NextFunction, Request, Response } from "express"
import { envVars } from "../../config/env";
import { StatusCodes } from "http-status-codes";
import z from "zod";
import { zodErrorHelper } from "../errorHelper/zodErrorHelper";
import { IErrorSorcess, TErrorResponse } from "../interfaces/interfaces";
import AppError from "../errorHelper/AppError";
import { deleteFileFromCloudinary } from "../../config/cloudinary";





// eslint-disable-next-line @typescript-eslint/no-unused-vars
const globalErrorHandler =async (err: unknown, req: Request, res: Response, next: NextFunction) => {

    if(envVars.NODE_ENV === "development"){
        console.log(err)
    }

    if(req.file){
        await deleteFileFromCloudinary(req.file.path)
    }

    if(req.files && Array.isArray(req.files) && req.files.length > 0){
        const imageUrls = req.files.map((file) => file.path);
        await Promise.all(imageUrls.map(url => deleteFileFromCloudinary(url))); 
    }

    let errorSorcess :IErrorSorcess[] = [];
    let statusCode:number = StatusCodes.INTERNAL_SERVER_ERROR;
    let message:string = 'Internal Server Error';
    let stack:undefined | string = undefined;

    if(err instanceof z.ZodError) {
        const simplifiedZodError = zodErrorHelper(err);
        statusCode = simplifiedZodError.statusCode;
        message = simplifiedZodError.message;
        errorSorcess = [...simplifiedZodError.errorSorcess];
        stack = err.stack;
    } else if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
        stack = err.stack;
        errorSorcess = [
            {
                path: '',
                message: err.message
            }
        ]
    }else if(err instanceof Error) {
        stack = err.stack;
        statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
        message = err.message;
        errorSorcess = [
            {
                path: '',
                message: err.message
            }
        ]
    }
    
    
    const errorResponse:TErrorResponse = {
        success:false,
        message: message,
        statusCode,
        errorSorcess,
        stack: envVars.NODE_ENV === 'development' ? stack : undefined,
        error: envVars.NODE_ENV === 'development' ? err instanceof Error ? err.message : String(err) : undefined,
    }

    res.status(statusCode).json(errorResponse)
};

export default globalErrorHandler;