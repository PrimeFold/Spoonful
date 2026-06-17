import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config();

const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;




export const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,  
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});



