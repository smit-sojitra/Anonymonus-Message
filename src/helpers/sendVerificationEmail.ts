import { resend } from "@/lib/resend"
import VerificationEmail from "../../emails/VerificationEmail"
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
        let info = await transporter.sendMail({
            from:"youu3908@gmail.com",
            to:email,
            subject:`Otp Verification`,
            html:`<div>
                  <p>Hello,${userName}</p>
                  <p>This is your OTP for verification:${verifyCode}</p>
                  </div>`,
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