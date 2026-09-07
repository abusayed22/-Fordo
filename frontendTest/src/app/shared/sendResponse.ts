import { Response } from "express";
import { envVars } from "../../config/env";


interface SendResponseInterface<T> {
    success: boolean;
    message:string;
    statusCode:number;
    data?: T,
    error?:string
}
const sendResponse = <T>(res:Response,responseData:SendResponseInterface<T>): void => {
    const {success,message,statusCode,data,error} = responseData;
    if(envVars.NODE_ENV === 'development' && !success) {
        console.log(responseData);
    }
    res.status(statusCode).json({success,message,data,error})
}

export default sendResponse;