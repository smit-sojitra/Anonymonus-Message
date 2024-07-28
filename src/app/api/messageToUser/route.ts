import dbConnect from "@/lib/dbConnect";
import UserModel, { Message } from "@/model/User";
import { NextResponse } from "next/server";

export async function POST(request:Request){
    await dbConnect();
    try {
        const {sender,username,content} = await request.json();
        console.log('username',sender)
        const user = await UserModel.findOne({userName:username}).sort({createdAt:-1})
        console.log('user',user)
        if(!user){
            return Response.json(
                { 
                    success: false,
                    message: "User not found"
                },
                { status:404 }
            )
        }
        const message = {
            user:sender,
            content:content,
            createdAt:new Date(),
        }
        user.messages.push(message as Message)
        await user.save();
        // const upadateUser = await UserModel.findOneAndUpdate(
        //     {userName:username},
        //     {$push:{messages:{username:sender,content:content,createdAt:new Date()}}},
        //     {new:true,sort:{createdAt:-1}},
        // )
        // console.log('updatedUser',upadateUser);
        return Response.json(
            {
                success: true,
                message: "Message successfully sent"
            },
            { status:200 }
        )
    } catch (error) {
        console.log("Error while sending message",error)
        return Response.json(
            {
                success:false,
                message:"Failed to send message"
            },
            {status:500}
        )
    }
}