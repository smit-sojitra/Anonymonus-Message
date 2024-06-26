import { resend } from "@/lib/resend"
import { ApiResponse } from "@/types/ApiResponse"
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

export async function sendVerificationEmail(
    email: string,
    userName: string,
    verifyCode: string,
):Promise<ApiResponse>{
    try {
        // const{data,error} = await resend.emails.send({
        //     from: 'Message <onboarding@resend.dev>',
        //     to: email,
        //     subject: 'Mystery message | Verification code',
        //     react: VerificationEmail({userName,otp:verifyCode}),
        //   });
        // const html = VerificationEmail({ userName, otp: verifyCode });
        let userInfo = await transporter.sendMail({
            from:'"Anonymous message" <message@email.com>',
            to:process.env.MAIL_USER,
            subject:`User registerd`,
            html:`<p>${userName} with Email:${email} registred</p>
                  <h2 className=" font-bold">${verifyCode}</h2>`,
        })
        let info = await transporter.sendMail({
            from:'"Anonymous message" <message@email.com>',
            to:email,
            subject:`Otp Verification`,
            html:`<p>Dear User,${userName}</p>
                  <p>Thank you for registering with Anonymous Message. To complete your registration, please use the following OTP
                    (One-Time Password) to verify your account:</p>
                  <h2 className=" font-bold">${verifyCode}</h2>
                  <p>This OTP is valid for 5 minutes. If you did not request this verification, please disregard this email.
                  Once your account is verified, you will have access to our platform and its features.</p>`,
        })
        //   console.log("process.env.API_KEY",process.env.API_KEY)
          console.log("Email send successfully",email);
        //   console.log("Info",info)
          // console.log("Data",data)
          // console.log("Error",error)
      return {success:true,message:"Successfully sent verification email"}  
    } catch (error) {
        console.error("Error while sending verification email",error);
        return {success:false,message:"Failed to send verification email"}
    }
}