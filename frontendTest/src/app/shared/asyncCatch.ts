import { NextFunction, Request, RequestHandler, Response } from "express"



const asyncCatch = (fn:RequestHandler) => {
    return async(req:Request,res:Response,next:NextFunction) => {
        try {
            await fn(req,res,next)
        } catch (error: unknown) {
            next(error)
            }
    }
}

export default asyncCatch;