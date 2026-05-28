import crypto from 'crypto';
import { prisma } from '../../lib/auth/auth';
import { transporter } from '../../lib/auth/nodemailer';

export const OTPGenerationAndValidation = async(email:string)=>{
    try {
        await transporter.verify();
        const code  =  Math.floor(100000 + Math.random() * 900000).toString();
        const hashedOtp = crypto.createHash("sha256").update(code).digest("hex");

        const OTP = await prisma.oTP.create({
            data:{
                email:email,
                otp:hashedOtp,
                expireAt: new Date(Date.now()+10 * 60 * 1000)
            }
        })

        if(!OTP){
            return {
                message:"Couldn't save OTP"
            }
        }   

   
        const emailHtml = (otp: string, name?: string) => `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </head>
            <body
              style="
                margin: 0;
                padding: 0;
                background-color: #f4f4f5;
                font-family: Arial, sans-serif;
              "
            >
              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                style="padding: 40px 20px;"
              >
                <tr>
                  <td align="center">
                    <table
                      width="100%"
                      cellpadding="0"
                      cellspacing="0"
                      style="
                        max-width: 500px;
                        background: #ffffff;
                        border-radius: 16px;
                        padding: 40px 30px;
                        box-shadow: 0 4px 20px rgba(0,0,0,0.06);
                      "
                    >
                      <tr>
                        <td align="center">
                          <h1
                            style="
                              margin: 0;
                              font-size: 28px;
                              color: #111827;
                            "
                          >
                            Verify your email
                          </h1>

                          <p
                            style="
                              margin-top: 12px;
                              font-size: 15px;
                              line-height: 24px;
                              color: #6b7280;
                            "
                          >
                            ${
                              name
                                ? `Hey ${name},`
                                : "Hey,"
                            }
                            use the verification code below to continue.
                          </p>

                          <div
                            style="
                              margin: 32px 0;
                              padding: 18px 24px;
                              background: #111827;
                              border-radius: 12px;
                              display: inline-block;
                            "
                          >
                            <span
                              style="
                                font-size: 36px;
                                letter-spacing: 8px;
                                font-weight: bold;
                                color: white;
                              "
                            >
                              ${otp}
                            </span>
                          </div>

                          <p
                            style="
                              margin-top: 8px;
                              font-size: 14px;
                              color: #6b7280;
                            "
                          >
                            This code expires in 10 minutes.
                          </p>

                          <p
                            style="
                              margin-top: 32px;
                              font-size: 13px;
                              line-height: 22px;
                              color: #9ca3af;
                            "
                          >
                            If you didn’t request this email, you can safely ignore it.
                          </p>
                        </td>
                      </tr>
                    </table>

                    <p
                      style="
                        margin-top: 20px;
                        font-size: 12px;
                        color: #9ca3af;
                      "
                    >
                      © 2026 Your App. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </body>
        </html>
`

        const mail = await transporter.sendMail({
            from:`Spoonfull <${process.env.SMPT_USER}>`,
            to:email,
            subject:"Verify Your email",
            html:emailHtml(code)
        })


        if(mail.pending){
            return{
                success:false,
                message:"Mail is sent and pending",
            }
        }

        const existingOTP = await prisma.oTP.findFirst({
            where:{
                email:email,
                otp:hashedOtp,
                expireAt:{
                    gt: new Date()
                }
            }
        })

        if(!existingOTP){
            return {
                success:false,
                message:"Wrong OTP , Please try again !",

            }
        }
        
        const verifiedUser = await prisma.user.update({
            where:{
                email:email,
            },
            data:{
                emailVerified:true
            }
        })

        if(!verifiedUser){
            return{
                success:true,
                message:"User not validated"
            }
        }

        const deletedOTP = await prisma.oTP.delete({
            where:{
                email:email,
                expireAt:{
                    gt: new Date()
                },
                otp:hashedOtp
            },
        })

        if(!deletedOTP){
            return {
                success:true,
                message:"Couldn't delete OTP"
            }
        }

        return {
            success:true,
            message:"Otp generated and sent",
        }

    } catch (error) {
        return{
            success:false,
            message:"Server error generating OTP"
        }
    }
}


