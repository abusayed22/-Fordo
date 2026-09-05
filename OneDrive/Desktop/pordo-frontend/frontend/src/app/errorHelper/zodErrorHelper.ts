import z from "zod";
import { IErrorSorcess, TErrorResponse } from "../interfaces/interfaces";
import { StatusCodes } from "http-status-codes";



export const zodErrorHelper = (err: z.ZodError):TErrorResponse => {
    const statusCode = StatusCodes.BAD_REQUEST;
    const message = "Zod Validation Error";
    const errorSorcess :IErrorSorcess[] = [];

    console.log("ERROR:",err)
    err.issues.map((issue) => errorSorcess.push({path:issue.path.join(' '),message:issue.message}));

    return {
        success:false,
        statusCode,
        message,
        errorSorcess,
    };
};