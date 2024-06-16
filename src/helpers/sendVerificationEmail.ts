import { resend } from "@/lib/resend"
import VerificationEmail from "../../emails/VerificationEmail"
import { ApiResponse } from "@/types/ApiResponse"

export async function sendVerificationEmail(
    email: string,
    userName: string,
    verifyCode: string,
):Promise<ApiResponse>{
    try {
        await resend.emails.send({
            from: 'you@example.com',
            to: email,
            subject: 'Mystery message | Verification code',
            react: VerificationEmail({userName,otp:verifyCode}),
          });
      return {success:true,message:"Successfully sent verification email"}  
    } catch (error) {
        console.error("Error while sending verification email",error);
        return {success:false,message:"Failed to send verification email"}
    }
}