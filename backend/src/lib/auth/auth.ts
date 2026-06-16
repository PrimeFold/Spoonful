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
            subject: "Reset your password - Spoonful",
            html: `
              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f9fafb; padding: 40px 20px; text-align: center;">
                <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 24px; padding: 40px; text-align: left; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
                  <div style="display: inline-block; background-color: #ff6b35; padding: 8px 16px; border-radius: 12px; font-weight: 900; color: #ffffff; font-size: 16px; margin-bottom: 24px;">
                    S
                  </div>
                  <h2 style="font-size: 22px; font-weight: 800; color: #111827; margin: 0 0 12px 0;">Reset your password</h2>
                  <p style="font-size: 14px; color: #4b5563; line-height: 1.6; margin: 0 0 24px 0;">
                    Hi ${user.name || "there"},<br/><br/>
                    We received a request to reset the password for your Spoonful account. Click the button below to choose a new password:
                  </p>
                  <div style="text-align: center; margin: 32px 0;">
                    <a href="${url}" style="display: inline-block; background-color: #ff6b35; color: #ffffff; font-size: 14px; font-weight: 700; text-decoration: none; padding: 14px 28px; border-radius: 16px; text-align: center; box-shadow: 0 4px 12px rgba(255, 107, 53, 0.25);">
                      Reset Password
                    </a>
                  </div>
                  <p style="font-size: 12px; color: #9ca3af; line-height: 1.6; margin: 0;">
                    If you didn't request a password reset, you can safely ignore this email. This link will remain active for 1 hour.
                  </p>
                  <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
                  <p style="font-size: 11px; color: #9ca3af; line-height: 1.6; margin: 0; word-break: break-all;">
                    If the button above doesn't work, copy and paste this URL into your browser:<br/>
                    <a href="${url}" style="color: #ff6b35; text-decoration: underline;">${url}</a>
                  </p>
                </div>
              </div>
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


