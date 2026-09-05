import dotEnv from "dotenv";
import AppError from "../app/errorHelper/AppError";
import { StatusCodes } from "http-status-codes";



dotEnv.config();

interface EmailSenderConfig {
    SMTP_USER: string
    SMTP_PASS: string
    SMTP_HOST: string
    SMTP_PORT: string
    SMTP_FROM: string
}

interface EnvVariable {
    PORT: string
    DATABASE_URL: string
    BETTER_AUTH_SECRET: string
    BETTER_AUTH_URL: string
    GOOGLE_CLIENT_ID: string
    GOOGLE_CLIENT_SECRET: string
    FACEBOOK_CLIENT_ID: string
    FACEBOOK_CLIENT_SECRET: string
    NODE_ENV: string
    JWT_SECRET: string
    ACCESS_TOKEN_SECRET: string
    REFRESH_TOKEN_SECRET: string
    ACCESS_TOKEN_EXPIRES_IN: string
    REFRESH_TOKEN_EXPIRES_IN: string
    EMAIL_SENDER_SMTP_USER: string
    EMAIL_SENDER_SMTP_PASS: string
    EMAIL_SENDER_SMTP_HOST: string
    EMAIL_SENDER_SMTP_PORT: string
    EMAIL_SENDER_SMTP_FROM: string
    EMAIL_SENDER: EmailSenderConfig
}

const eVarialble = (): EnvVariable => {

    const types = [
        "PORT",
        "DATABASE_URL",
        "BETTER_AUTH_SECRET",
        "BETTER_AUTH_URL",
        "GOOGLE_CLIENT_ID",
        "GOOGLE_CLIENT_SECRET",
        "FACEBOOK_CLIENT_ID",
        "FACEBOOK_CLIENT_SECRET",
        "NODE_ENV",
        "JWT_SECRET",
        "ACCESS_TOKEN_SECRET",
        "REFRESH_TOKEN_SECRET",
        "ACCESS_TOKEN_EXPIRES_IN",
        "REFRESH_TOKEN_EXPIRES_IN",
        "EMAIL_SENDER_SMTP_USER",
        "EMAIL_SENDER_SMTP_PASS",
        "EMAIL_SENDER_SMTP_HOST",
        "EMAIL_SENDER_SMTP_PORT",
        "EMAIL_SENDER_SMTP_FROM",
    ]

    types.forEach(variable => {
        if (!process.env[variable]) {
            throw new AppError(StatusCodes.NOT_FOUND, `${variable} not found env config`, "")
        }
    });


    return {
        PORT: process.env.PORT as string,
        DATABASE_URL: process.env.DATABASE_URL as string,
        BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET as string,
        BETTER_AUTH_URL: process.env.BETTER_AUTH_URL as string,
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,
        FACEBOOK_CLIENT_ID: process.env.FACEBOOK_CLIENT_ID as string,
        FACEBOOK_CLIENT_SECRET: process.env.FACEBOOK_CLIENT_SECRET as string,
        NODE_ENV: process.env.NODE_ENV as string,
        JWT_SECRET: process.env.JWT_SECRET as string,
        EMAIL_SENDER_SMTP_USER: process.env.EMAIL_SENDER_SMTP_USER as string,
        EMAIL_SENDER_SMTP_PASS: process.env.EMAIL_SENDER_SMTP_PASS as string,
        EMAIL_SENDER_SMTP_HOST: process.env.EMAIL_SENDER_SMTP_HOST as string,
        EMAIL_SENDER_SMTP_PORT: process.env.EMAIL_SENDER_SMTP_PORT as string,
        ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET as string,
        REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET as string,
        ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN as string,
        REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN as string,
        EMAIL_SENDER_SMTP_FROM: process.env.EMAIL_SENDER_SMTP_FROM as string,
        EMAIL_SENDER: {
            SMTP_USER: process.env.EMAIL_SENDER_SMTP_USER as string,
            SMTP_PASS: process.env.EMAIL_SENDER_SMTP_PASS as string,
            SMTP_HOST: process.env.EMAIL_SENDER_SMTP_HOST as string,
            SMTP_PORT: process.env.EMAIL_SENDER_SMTP_PORT as string,
            SMTP_FROM: process.env.EMAIL_SENDER_SMTP_FROM as string,
        }
    }

}


export const envVars = eVarialble()
