"use server";
import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
import { cookieUtils } from "./cookieUtils";


// const  JWT_TOKEN_SECRET = "modimaldey"
const  JWT_TOKEN_SECRET = "sadfsadgfe4f3fg4fwgtu6"


const getTokenSecondRemaining = (token:string):number => {

    if(!token) {
        return 0;
    }
    try {

        const payloadToken = JWT_TOKEN_SECRET ? jwt.verify(token, JWT_TOKEN_SECRET) as JwtPayload : jwt.decode(token)as JwtPayload;
        // console.log("payloadToken", payloadToken)
        if(payloadToken && !payloadToken.exp){
            return 0;
        }


        const secondRemaining = payloadToken.exp as number -Math.floor(Date.now() / 1000);
        return secondRemaining > 0 ? secondRemaining : 0;

    } catch (error) {
        console.log(error);
        return 0;
    }
}


export const setTokenInCookie = async(name:string, token:string,fallbackMaxAgeInSeconds = 60 * 60 * 24) => {
        let maxAgeInSeconds;

    if (name !== "better-auth.session_token"){
        maxAgeInSeconds = getTokenSecondRemaining(token);
    }

    await cookieUtils.setCookie(name, token, maxAgeInSeconds || fallbackMaxAgeInSeconds);
    // const maxAge = getTokenSecondRemaining(token);
    // cookieUtils.setCookie(name, token, maxAge);
}

