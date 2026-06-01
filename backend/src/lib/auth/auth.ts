import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client";
import dotenv from 'dotenv'

dotenv.config();


const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
export const prisma = new PrismaClient({adapter});
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

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
        enabled:true
    },
    baseURL:baseUrl,
    cookieOptions:{
        httpOnly:true,
        secure:false,
        sameSite:'lax',
        path:'/'
    },
    trustedOrigins:[
        frontendUrl as string
    ],
    advanced:{
        cookiePrefix:"better-auth",
        disableOriginCheck:process.env.NODE_ENV!=='production',

    },
    
});




