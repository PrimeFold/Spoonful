import nodemailer from 'nodemailer'
import crypto from 'crypto'

const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;

if(!pass){
    console.log("user pass not found")
}

if(!user){
    console.log("user  not found")
}


export const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,  
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});



