import jwt,{ JwtPayload, SignOptions } from "jsonwebtoken";


const createToken = (payload:JwtPayload,secret:string,{expiresIn}:SignOptions) => {
    return jwt.sign(payload,secret,{expiresIn});
}

const verifyToken = (token:string,secret:string) => {
    try {
        const decodedToken = jwt.verify(token,secret) as JwtPayload;
        return {
            success: true,
            data: decodedToken,
        }
    } catch (err) {
        return {
            success:false,
            message: err.message,
            err
        };
    }
}

const decodeToken = (token:string) => {
    return jwt.decode(token);
}



export const jwtService = {
    createToken,
    verifyToken,
    decodeToken,
}               
