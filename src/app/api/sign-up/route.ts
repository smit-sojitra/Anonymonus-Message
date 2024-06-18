import dbConnect from "@/lib/dbConnect";
import bcrypt from "bcryptjs";
import UserModel from "@/model/User";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(req:Request){
    await dbConnect()
    try {
        const {userName,email,password} = await req.json()
        const existingUserVerifiedByUsername = await UserModel.findOne({
                                                            userName,
                                                            isVerified:true,
        })
        console.log("User:-",existingUserVerifiedByUsername)
        if(existingUserVerifiedByUsername){
            return Response.json({
                success:false,
                message:"UserName is already taken"
            },{status:500})
        }
        const existingUserByEmail = await UserModel.findOne({email})
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString(); 
        if(existingUserByEmail){
            if(existingUserByEmail.isVerified){
                return Response.json({
                    success:false,
                    message:"User already exist with this email",
                },{status:500})
            }else{
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 60*60*1000)
                await existingUserByEmail.save();
            }
        }else{
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);
            const newUser = new UserModel({
                userName,
                email,
                password:hashedPassword,
                verifyCode:verifyCode,
                verifyCodeExpiry:expiryDate,
                isVerified:false,
                isAcceptingMessage:true,
                message:[],
            })
            await newUser.save();
        }
        // send verification email
        const emailResponse = await sendVerificationEmail(
            email,userName,verifyCode
        )
        if(!emailResponse.success){
            return Response.json({
                success:false,
                message:emailResponse.message,
            },{status:500})
        }
        return Response.json({
            success:true,
            message:emailResponse,
        },{status:201})
    } catch (error) {
        console.log("Error while signing up:-",error);
        return Response.json(
            {
                success: false,
                message: "Error registering user"
            },
            {
                status: 500
            }
        )
    }
}