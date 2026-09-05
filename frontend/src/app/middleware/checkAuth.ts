

import { NextFunction, Request, Response } from "express";
import { cookiesUtils } from "../utils/cookies";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../lib/prisma";
import { jwtService } from "../utils/jwt";
import { UserRole, UserStatus } from "../../generated/prisma/enums";
import AppError from "../errorHelper/AppError";
import { envVars } from "../../config/env";




export const checkAuth = (...authRoles: UserRole[]) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        //Session Token Verification
        const sessionToken = cookiesUtils.getCookie(req, "better-auth.session_token");

        if (!sessionToken) {
            throw new Error('Unauthorized access! No session token provided.');
        }

        if (sessionToken) {
            const sessionExists = await prisma.session.findFirst({
                where: {
                    token: sessionToken,
                    expiresAt: {
                        gt: new Date(),
                    }
                },
                include: {
                    user: true,
                }
            })

            if (sessionExists && sessionExists.user) {
                const user = sessionExists.user;

                const now = new Date();
                const expiresAt = new Date(sessionExists.expiresAt)
                const createdAt = new Date(sessionExists.createdAt)

                const sessionLifeTime = expiresAt.getTime() - createdAt.getTime();
                const timeRemaining = expiresAt.getTime() - now.getTime();
                const percentRemaining = (timeRemaining / sessionLifeTime) * 100;

                if (percentRemaining < 20) {
                    res.setHeader('X-Session-Refresh', 'true');
                    res.setHeader('X-Session-Expires-At', expiresAt.toISOString());
                    res.setHeader('X-Time-Remaining', timeRemaining.toString());

                    console.log("Session Expiring Soon!!");
                }

                if (user.status === UserStatus.BLOCKED || user.status === UserStatus.INACTIVE) {
                    throw new AppError(StatusCodes.UNAUTHORIZED, 'Unauthorized access! User is not active.');
                }

                if (user.isDeleted) {
                    throw new AppError(StatusCodes.UNAUTHORIZED, 'Unauthorized access! User is deleted.');
                }

                if (authRoles.length > 0 && !authRoles.includes(user.role)) {
                    throw new AppError(StatusCodes.FORBIDDEN, 'Forbidden access! You do not have permission to access this resource.');
                }

                // set user in request
                req.user = {
                        userId : user.id,
                        role : user.role,
                        email : user.email,
                    }
            }


            const accessToken = cookiesUtils.getCookie(req, 'accessToken');

            if (!accessToken) {
                throw new AppError(StatusCodes.UNAUTHORIZED, 'Unauthorized access! No access token provided.');
            }


        }

        //Access Token Verification
        const accessToken = cookiesUtils.getCookie(req, 'accessToken');

        if (!accessToken) {
            throw new AppError(StatusCodes.UNAUTHORIZED, 'Unauthorized access! No access token provided.');
        }

        const verifiedToken = jwtService.verifyToken(accessToken, envVars.ACCESS_TOKEN_SECRET);

        if (!verifiedToken.success) {
            throw new AppError(StatusCodes.UNAUTHORIZED, 'Unauthorized access! Invalid access token.');
        }

        if (authRoles.length > 0 && !authRoles.includes(verifiedToken.data!.role as UserRole)) {
            throw new AppError(StatusCodes.FORBIDDEN, 'Forbidden access! You do not have permission to access this resource.');
        }

        next()
    } catch (err) {
        // throw new AppError(StatusCodes.UNAUTHORIZED, "Unauthorized", err);
        next(err);
    }
}
