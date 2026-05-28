import { prisma } from "../../lib/auth/auth";
import { transporter } from "../../lib/auth/nodemailer";
import { emailHtml } from "../../lib/emailHtml";
import crypto from 'crypto'

export const generateOtp = async (email: string) => {
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  const hashedOtp = crypto
    .createHash("sha256")
    .update(code)
    .digest("hex");

  await prisma.oTP.create({
    data: {
      email,
      otp: hashedOtp,
      expireAt: new Date(Date.now() + 10 * 60 * 1000),
    },
  });

  await transporter.sendMail({
    from: `Spoonfull <${process.env.SMPT_USER}>`,
    to: email,
    subject: "Verify Your Email",
    html: emailHtml(code),
  });

  return {
    success: true,
    message: "OTP sent",
  };
};

export const verifyOtp = async (
  email: string,
  userOtp: string
) => {
  const hashedUserOtp = crypto.createHash("sha256").update(userOtp).digest("hex");

  const record = await prisma.oTP.findFirst({
    where: {
      email,
      expireAt: {
        gt: new Date(),
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

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

  await prisma.user.update({
    where: { email },
    data: {
      emailVerified: true,
    },
  });

  await prisma.oTP.deleteMany({
    where: { email },
  });

  return {
    success: true,
    message: "OTP verified",
  };
};