import { transporter } from "../../lib/auth/nodemailer";
import { emailHtml } from "../../lib/emailHtml";
import crypto from 'crypto'
import { AuthRepository } from "./auth.repository";

export const generateOtp = async (email: string) => {
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  const hashedOtp = crypto
    .createHash("sha256")
    .update(code)
    .digest("hex");
  try {
    await AuthRepository.SaveOTPtoDb(hashedOtp,email);
  
    await transporter.sendMail({
      from: `Spoonfull`,
      to: email,
      subject: "Verify Your Email",
      html: emailHtml(code),
    });
    console.log("Email sent 💌")
    return {
      success: true,
      message: "OTP sent",
    };
    
  } catch (error) {
    return{
      success:false,
      message:(error as Error).message ?? "Internal Server Error",
    }
  }

};

export const verifyOtp = async ( email:string,  userOtp:string ) => {
  const hashedUserOtp = crypto.createHash("sha256").update(userOtp).digest("hex");
  try {
    
      const record = await AuthRepository.FindOTPHash(email);

    if (!record) {
      return {
        success: false,
        message: "OTP expired or not found",
      };
    }

    if (record.otp !== hashedUserOtp) {
      return {
        success: false,
        message: "Invalid OTP",
      };
    }

    const verified = await AuthRepository.UpdatedUserVefifiedStatus(email);

    if(!verified){
      return{
        success:false,
        message:"couldn't verify user ",
        data:null
      }
    }

    const deletion = await AuthRepository.deleteStoredOtp(email);

    if(!deletion){
      return{
        success:true,
        message:"Otp deletion failed from db",
        data:null
      }
    }


    return {
      success: true,
      message: "OTP verified",
    };

  } catch (error) {
    return{
      success:false,
      message:(error as Error).message || "Internal Server Error",
      data:null
    }
  }
  
};