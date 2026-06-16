import { createAuthClient } from "better-auth/react";
import { api } from "./axios";
export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_URL,
});

export type Session = typeof authClient.$Infer.Session;

export type User = Session["user"];

export const verifyOtp = async(otp:string)=>{
  const res=  await api.post('/otp/verify',{otp})
  return res.data;
}

export const generateOtp = async()=>{
  const {data} = await api.post('/otp/generate')
  return data ;
}

export const findUser = async(email:string)=>{
  const{data} = await api.get('/current-user-details',{
    params:{email}
  })
  return data;
}