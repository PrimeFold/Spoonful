import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client";
import dotenv from 'dotenv'
import { transporter } from "./nodemailer";

dotenv.config();


const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
export const prisma = new PrismaClient({adapter});
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
let baseUrl = process.env.BASE_URL || 'http://localhost:3000';
if (baseUrl === '/') {
    baseUrl = 'http://localhost:3000';
}
console.log("BASE URL =", baseUrl);
console.log("NODE_ENV =", process.env.NODE_ENV);

if(!baseUrl){
    console.log("base url not found")
}
if(!frontendUrl){
    console.log("frontend url missing")
}
export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", 
    }),
    emailAndPassword:{
        enabled:true,
        revokeSessionsOnPasswordReset:true,
        sendResetPassword: async ({user, url, token}, request) => {
          await transporter.sendMail({
            to: user.email,
            subject: "Reset your password",
            text: `
              <p>Click below to reset your password:</p>
              <a href="${url}">Reset Password</a>
            `,
          });
        },
    },
    baseURL:baseUrl,
    trustedOrigins:[
        frontendUrl as string
    ],
    advanced:{
        cookiePrefix:"better-auth",
        disableOriginCheck:process.env.NODE_ENV!=='production',
        defaultCookieAttributes:{
            sameSite: process.env.NODE_ENV === 'production' ? "none" : "lax",
            secure: process.env.NODE_ENV === 'production',
            httpOnly:true
        }
    },
    user: {
        additionalFields: {
            role: {
                type: "string",
                required: false,
                defaultValue: "STUDENT",
                input: false, // not settable by user
            },
        },
    },
});
console.log(auth.options);


