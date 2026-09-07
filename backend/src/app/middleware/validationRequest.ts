import { NextFunction, Request, Response } from "express";
import z from "zod";
import { envVars } from "../../config/env";


export const ValidationRequest = (zodSchema:z.ZodObject) => {
    return async (req:Request, res:Response, next:NextFunction) => {
        
        if (typeof req.body.data === "string") {
        req.body = JSON.parse(req.body.data);
        }

        const validation = zodSchema.safeParse(req.body);

        if (!validation.success) {
             
                 next(validation.error);
            }
            if (envVars.NODE_ENV === 'development') {
                console.log(validation.error);
            }

        // sanitization
        req.body = validation.data;
        next();
    }
}