import { IRequestUser } from './../../interfaces/interfaces';
import { auth } from "../../lib/auth";
import { tokenUtils } from "../../utils/token";
import { prisma } from '../../lib/prisma';
import AppError from '../../errorHelper/AppError';
import { StatusCodes } from 'http-status-codes';
import { envVars } from '../../../config/env';
import { jwtService } from '../../utils/jwt';
import { JwtPayload } from 'jsonwebtoken';
import { IChangePasswordPayload } from './auth.interface';


interface IRegisterPayload {
    name: string,
    email: string,
    password: string
}
interface ILoginPayload {
    email: string,
    password: string
}


const authRegister = async (payload: IRegisterPayload) => {
    const { name, email, password } = payload;
    const data = await auth.api.signUpEmail({
        body: {
            name,
            email,
            password
        },
        // asResponse: true,
    });

    if (!data.user) {
        throw new Error("Registration failed");
    }


    // if new table record data so TODO:


    const accessToken = tokenUtils.getAccessToken(
        {
            name: data.user.name,
            email: data.user.email,
            userId: data.user.id,
            role: data.user.role,
            status: data.user.status,
            isDeleted: data.user.isDeleted,
        }
    );

    const refreshToken = tokenUtils.getRefreshToken(
        {
            name: data.user.name,
            email: data.user.email,
            userId: data.user.id,
            role: data.user.role,
            status: data.user.status,
            isDeleted: data.user.isDeleted,
        });

    return {
        ...data,
        accessToken,
        refreshToken
    };
}


const authLogin = async (payload: ILoginPayload) => {
    const { email, password } = payload;

    const data = await auth.api.signInEmail({
        body: {
            email,
            password
        },
        // asResponse:true
    });



    // if(data.user.isDeleted){
    //     throw new Error("User email not found, user is deleted!");
    // }

    // if(data.user.status === UserStatus.BLOCKED){
    //     throw new Error("User Blocked!");
    // }

    // if(data.user.status === UserStatus.INACTIVE){
    //     throw new Error("User Inactive!");
    // }
    // if(data.user.status === UserStatus.SUSPENDED){
    //     throw new Error("User Suspended!");
    // }


    const accessToken = tokenUtils.getAccessToken(
        {
            name: data.user.name,
            email: data.user.email,
            userId: data.user.id,
            role: data.user.role,
            status: data.user.status,
            isDeleted: data.user.isDeleted,
        }
    );

    const refreshToken = tokenUtils.getRefreshToken(
        {
            name: data.user.name,
            email: data.user.email,
            userId: data.user.id,
            role: data.user.role,
            status: data.user.status,
            isDeleted: data.user.isDeleted,
        });

    return {
        ...data,
        accessToken,
        refreshToken
    }
}


const getMe = async (user: IRequestUser) => {
    const data = await prisma.user.findUnique({
        where: {
            id: user.userId
        }
    });

    if (!data) {
        throw new AppError(StatusCodes.NOT_FOUND, "User not found");
    }

    return data;
}



const getNewToken = async (refreshToken: string, sessionToken: string) => {

    const isSessionTokenExists = await prisma.session.findUnique({
        where: {
            token: sessionToken,
        },
        include: {
            user: true,
        }
    })

    if (!isSessionTokenExists) {
        throw new AppError(StatusCodes.UNAUTHORIZED, "Invalid session token");
    }

    const verifiedRefreshToken = jwtService.verifyToken(refreshToken, envVars.REFRESH_TOKEN_SECRET)


    if (!verifiedRefreshToken.success && verifiedRefreshToken.err) {
        throw new AppError(StatusCodes.UNAUTHORIZED, "Invalid refresh token");
    }

    const data = verifiedRefreshToken.data as JwtPayload;

    const newAccessToken = tokenUtils.getAccessToken({
        userId: data.userId,
        role: data.role,
        name: data.name,
        email: data.email,
        status: data.status,
        isDeleted: data.isDeleted,
        emailVerified: data.emailVerified,
    });

    const newRefreshToken = tokenUtils.getRefreshToken({
        userId: data.userId,
        role: data.role,
        name: data.name,
        email: data.email,
        status: data.status,
        isDeleted: data.isDeleted,
        emailVerified: data.emailVerified,
    });

    const { token } = await prisma.session.update({
        where: {
            token: sessionToken
        },
        data: {
            token: sessionToken,
            expiresAt: new Date(Date.now() + 60 * 60 * 60 * 24 * 1000),
            updatedAt: new Date(),
        }
    })

    return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        sessionToken: token,
    }
}


const changePassword = async (payload: IChangePasswordPayload, sessionToken: string) => {
    const { oldPassword, newPassword } = payload;
    const session = await auth.api.getSession({
        headers: new Headers({
            "Authorization": `Bearer ${sessionToken}`
        })
    });
    if (!session) {
        throw new AppError(StatusCodes.UNAUTHORIZED, "Invalid session token");
    }

    const data = await auth.api.changePassword({
        body: {
            currentPassword: oldPassword,
            newPassword,
            revokeOtherSessions: true,
        },
        headers: new Headers({
            "Authorization": `Bearer ${sessionToken}`
        })
    });


    const accessToken = tokenUtils.getAccessToken(
        {
            name: session.user.name,
            email: session.user.email,
            userId: session.user.id,
            role: session.user.role,
            status: session.user.status,
            isDeleted: session.user.isDeleted,
        }
    );

    const refreshToken = tokenUtils.getRefreshToken(
        {
            name: session.user.name,
            email: session.user.email,
            userId: session.user.id,
            role: session.user.role,
            status: session.user.status,
            isDeleted: session.user.isDeleted,
        });

    return {
        ...data,
        accessToken,
        refreshToken
    };
};



const logoutUser = async (sessionToken: string) => {
    const data = await auth.api.signOut({
        headers: new Headers({
            "Authorization": `Bearer ${sessionToken}`
        })
    });
    return data;
}


const verifyEmail = async (email: string, otp: string) => {
    const result = await auth.api.verifyEmailOTP({
        body: {
            email,
            otp
        }
    });

    if(result.status && !result.user.emailVerified){
        await prisma.user.update({
            where:{
                email:email
            },
            data:{
                emailVerified:true
            }
        })
        return result;
    }
}




export const AuthService = {
    authRegister,
    authLogin,
    getMe,
    getNewToken,
    changePassword,
    logoutUser,
    verifyEmail,
}