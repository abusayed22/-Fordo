import { AuthService } from './auth.service';
import { Request, Response } from "express";
import asyncCatch from "../../shared/asyncCatch";
import sendResponse from "../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import { tokenUtils } from "../../utils/token";
import { cookiesUtils } from "../../utils/cookies";
import AppError from "../../errorHelper/AppError";



const authRegister = asyncCatch(async (req: Request, res: Response) => {
  const payload = req.body;

  const result = await AuthService.authRegister(payload);

  cookiesUtils.setCookie(res, "accessToken", result.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 60 * 24 * 7, // 1 দিন
  });

  cookiesUtils.setCookie(res, "refreshToken", result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 60 * 24, // 1 দিন
  });

  sendResponse(res, { success: true, statusCode: StatusCodes.CREATED, message: "Registration Successfully.", data: result })

})


const authLogin = asyncCatch(async (req: Request, res: Response) => {
  const payload = req.body;

  const result = await AuthService.authLogin(payload);

  const { accessToken, refreshToken, token, ...rest } = result;
  tokenUtils.setBetterAuthSessionCookie(res, token);
  tokenUtils.setAccessToken(res, accessToken);
  tokenUtils.setRefreshToken(res, refreshToken);



  sendResponse(res, {
    success: true, statusCode: StatusCodes.OK, message: "Login Successfully.", data: {
      ...rest,
      token,
      accessToken,
      refreshToken
    }
  })

})


const getMe = asyncCatch(async (req: Request, res: Response) => {
  const payload = req.user;
  const result = await AuthService.getMe(payload);
  sendResponse(res, {
    success: true, statusCode: StatusCodes.OK, message: "My data fetch Successfully.", data: {
      ...result,
    }
  })
})


const getNewToken = asyncCatch(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "Unauthorized access! No refresh token provided.");
  }
  const betterAuthSessionToken = req.cookies["better-auth.session_token"];
  const result = await AuthService.getNewToken(refreshToken, betterAuthSessionToken);
  const { accessToken, refreshToken: newRefreshToken, sessionToken } = result;

  tokenUtils.setAccessToken(res, accessToken);
  tokenUtils.setRefreshToken(res, newRefreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, sessionToken);

  sendResponse(res, {
    success: true, statusCode: StatusCodes.OK, message: "New token generate Successfully.", data: {
      accessToken,
      refreshToken: newRefreshToken,
      sessionToken
    }
  })
});


const changePassword = asyncCatch(async (req: Request, res: Response) => {
  const payload = req.body;
  const sessionToken = req.cookies["better-auth.session_token"];
  const result = await AuthService.changePassword(payload, sessionToken);
  
  const { accessToken, refreshToken,token } = result;

  tokenUtils.setAccessToken(res, accessToken);
  tokenUtils.setRefreshToken(res, refreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, token as string);

  sendResponse(res, {
    success: true, statusCode: StatusCodes.OK, message: "Password change Successfully.", data: {
      ...result,
    }
  })
});


const logoutUser = asyncCatch(async(req:Request,res:Response) => {
  
  const sessionToken = req.cookies["better-auth.session_token"];
  const result = await AuthService.logoutUser(sessionToken);
  
  cookiesUtils.clearCookie(res,"better-auth.session_token",{
    httpOnly:true,
    secure:true,
    sameSite:"none",
  })
  cookiesUtils.clearCookie(res,"accessToken",{
    httpOnly:true,
    secure:true,
    sameSite:"none",
  });
  cookiesUtils.clearCookie(res,"refreshToken",{
    httpOnly:true,
    secure:true,
    sameSite:"none",
  })
 
  sendResponse(res,{
    success:true,
    statusCode:StatusCodes.OK,
    message:"Logout Successfully.",
    data:result
  })
})


const verifyEmail = asyncCatch(async (req: Request, res: Response) => {
  const {email,otp} = req.body;
  await AuthService.verifyEmail(email, otp);
  
  sendResponse(res,{
    success:true,
    statusCode:StatusCodes.OK,
    message:"Email Verification Successfully.",
  })
});


const forgotPassword = asyncCatch(async (req: Request, res: Response) => {
  const payload = req.body;
  await AuthService.forgotPassword(payload.email);
  
  sendResponse(res,{
    success:true,
    statusCode:StatusCodes.OK,
    message:"Sending OTP Successfully for new password.",
  })
});


const resetPassword = asyncCatch(async (req: Request, res: Response) => {
  const payload = req.body;
  await AuthService.resetPassword(payload.email, payload.otp, payload.newPassword);
  
  sendResponse(res,{
    success:true,
    statusCode:StatusCodes.OK,
    message:"Password reset Successfully.",
  })
});




export const AuthController = { authRegister, authLogin, getMe, getNewToken, changePassword, logoutUser, verifyEmail, forgotPassword, resetPassword }