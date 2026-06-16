import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
import { api } from "./axios";

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_URL,
  plugins: [
    inferAdditionalFields({
      user: {
        role: {
          type: "string",
          required: false,
          defaultValue: "STUDENT",
        },
      },
    }),
  ],
});

export type Session = typeof authClient.$Infer.Session;

export type User = Session["user"] & { role?: "STUDENT" | "ADMIN" | "OWNER" };

export const verifyOtp = async(otp:string)=>{
  const res=  await api.post('/otp/verify',{otp})
  return res.data;
}

export const generateOtp = async()=>{
  const {data} = await api.post('/otp/generate')
  return data ;
}

