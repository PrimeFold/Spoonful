import nodemailer from 'nodemailer'
import crypto from 'crypto'

export const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:process.env.SMTP_USER,
        pass:process.env.SMTP_PASS
    }
})



const otp =  Math.floor(100000 + Math.random() * 900000).toString();

export const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");


