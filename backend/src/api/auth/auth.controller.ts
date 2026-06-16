
import { auth } from "../../lib/auth/auth";
import type { Handler } from "../../types";
import { verifyOtp, generateOtp } from "./auth.service";

export const VerifyOtpController : Handler = async (
  req,
  res
) => {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
    if (!session?.user?.email) {
      return res.status(401).json({ message: "No session" });
    }

    const email = session.user.email;

    const { otp } = req.body;

    const result = await verifyOtp(email, otp);

    if(!result.success){
        return res.status(400).json({
            message:result.message
        })
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};


export const GenerateOtpController : Handler= async (req,res) => {
  try {
    console.log("Otp controller started")
    const session = await auth.api.getSession({
      headers: req.headers,
    });
    console.log("cookie : ", req.headers.cookie)
    if (!session) {
      console.log("❌ no session found");
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!session?.user?.email) {
      console.log("❌ no email in session");
      return res.status(401).json({ message: "No session email" });
    }


    console.log("Session user verified and proceeding..")
    const email = session.user.email;
    const result = await generateOtp(email);
    console.log(result.success)
    return res.status(200).json(result);

  } catch (error) {

    return res.status(500).json({
      message: "Internal Server Error",
      error: error instanceof Error ? error.message : error,
    });
  }
};