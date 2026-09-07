
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { UserRole, UserStatus } from "../../generated/prisma/enums";
import { envVars } from "../../config/env";
import { bearer, emailOTP } from "better-auth/plugins";
import { sendEmail } from "../utils/mailer";



export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    baseURL: envVars.BETTER_AUTH_URL,
    trustedOrigins: [envVars.FRONTEND_URL,envVars.BETTER_AUTH_URL],
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
    },
    emailVerification: {
        sendOnSignUp: true,
        sendOnSignIn: true,
        autoSignInAfterVerification: true,
    },
    socialProviders: {
        google: {
            clientId: envVars.GOOGLE_CLIENT_ID as string,
            clientSecret: envVars.GOOGLE_CLIENT_SECRET as string,
        },
        facebook: {
            clientId: envVars.FACEBOOK_CLIENT_ID as string,
            clientSecret: envVars.FACEBOOK_CLIENT_SECRET as string,
        }
    },
    user: {
        additionalFields: {
            role: {
                type: "string",
                required: false,
                defaultValue: UserRole.CUSTOMER,
                input: false
            },
            status: {
                type: "string",
                required: true,
                defaultValue: UserStatus.ACTIVE
            },
            isDeleted: {
                type: "boolean",
                required: true,
                defaultValue: false
            },
            needPasswordChange: {
                type: "boolean",
                required: true,
                defaultValue: false
            }
        }
    },
    // trustedOrigins: ['http://localhost:5000'],
    // advanced:{
    //     disableCSRFCheck:true
    // }

    plugins: [
        bearer(),
        emailOTP({
            overrideDefaultEmailVerification: true,
            async sendVerificationOTP({ email, otp, type }) {
                if (type === "email-verification") {
                    const user = await prisma.user.findUnique({
                        where: {
                            email,
                        }
                    })

                    if (user && !user.emailVerified) {
                        sendEmail({
                            to: email,
                            subject: "Verify your email",
                            templateName: "otp",
                            templateData: {
                                name: user.name,
                                otp,
                                expiresIn:'2 minutes'
                            }
                        })
                    }
                } else if (type === "forget-password") {
                    const user = await prisma.user.findUnique({
                        where: {
                            email,
                        }
                    })

                    if (user) {
                        sendEmail({
                            to: email,
                            subject: "Password Reset OTP",
                            templateName: "otp",
                            templateData: {
                                name: user.name,
                                otp,
                            }
                        })
                    }
                }
            },
            expiresIn: 2 * 60, // 2 minutes in seconds
            otpLength: 6,
        })
    ],

    session: {
        expiresIn: 60 * 60 * 60 * 24, //Number(envVars.ACCESS_TOKEN_EXPIRES_IN as string),  // 1day
        updateAge: 60 * 60 * 60 * 24,// Number(envVars.ACCESS_TOKEN_EXPIRES_IN), // 1 day in seconds
        cookieCache: {
            enabled: true,
            maxAge: 60 * 60 * 60 * 24, // Number(envVars.ACCESS_TOKEN_EXPIRES_IN), // 1 day in seconds
        }
    }

})