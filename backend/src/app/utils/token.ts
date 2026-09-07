import { JwtPayload, SignOptions } from "jsonwebtoken";
import { jwtService } from "./jwt";
import { envVars } from "../../config/env";
import { cookiesUtils } from "./cookies";
import { Response } from "express";


const getAccessToken = (payload:JwtPayload) => {
    const accessToken = jwtService.createToken(payload,envVars.ACCESS_TOKEN_SECRET,{expiresIn:60 * 60 * 60 * 24 * 7} as SignOptions)
    return accessToken;
}

const getRefreshToken = (payload:JwtPayload) => {
    // const refreshToken = jwtService.createToken(payload,envVars.ACCESS_TOKEN_SECRET,{expiresIn:60 * 60 * 60 * 24 * 7} as SignOptions)
    const refreshToken = jwtService.createToken(payload,envVars.REFRESH_TOKEN_SECRET,{expiresIn:60 * 60 * 60 * 24 * 7} as SignOptions)
    return refreshToken;
}

const setAccessToken = (res:Response,token:string) => {
    cookiesUtils.setCookie(res,"accessToken",token,{
        httpOnly:true,
        secure:true,
        sameSite:"none",
        path:"/",
        maxAge:  60 * 60 * 24 * 1000, // Number(envVars.ACCESS_TOKEN_EXPIRES_IN),
        // domain:envVars.DOMAIN
    })
}

const setRefreshToken = (res:Response,token:string) => {
    cookiesUtils.setCookie(res,"refreshToken",token,{
        httpOnly:true,
        secure:true,
        sameSite:"none",
        path:"/",
        maxAge: 60 * 60 * 24 * 1000 * 7,  //Number(envVars.REFRESH_TOKEN_EXPIRES_IN),
        // domain:envVars.DOMAIN
    })
}

const setBetterAuthSessionCookie = (res:Response,token:string) => {
    cookiesUtils.setCookie(res,"better-auth.session_token",token,{
        httpOnly:true,
        secure:true,
        sameSite:"none",
        path:"/",
        maxAge:60 * 60 * 24 * 1000 ,  //Number(envVars.ACCESS_TOKEN_EXPIRES_IN),
        // domain:envVars.DOMAIN
    })
}



export const tokenUtils = {
    getAccessToken,
    getRefreshToken,
    setAccessToken,
    setRefreshToken,
    setBetterAuthSessionCookie
}