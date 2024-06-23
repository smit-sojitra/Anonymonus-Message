import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { authOptions } from "../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(request:Request){
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user:User = session?.user;
    if(!session || !session.user){
        return Response.json(
            {
                success: false,
                message: "Not Authenticated"
            },
            { status:500 }
        )
    }
    const userId = new mongoose.Types.ObjectId(user._id);
   
    try {
        const user = await UserModel.aggregate([
            { $match: {_id:userId} },
            { $unwind :'$messages' },
            { $sort:{'messages.createdAt':-1}},
            {$group:{_id:'$_id',messages:{$push:'$messages'}}}
        ])
        // console.log("user",user)
        if(!user){
            return Response.json(
                {
                    success: false,
                    message: "User not found",
                    
                },
                { status:500 }
            )
        }if(user.length === 0){
            return Response.json(
                {
                    success: true,
                    message: "User have yet to message",
                },
                { status:200 }
            )
        }
        return Response.json(
            {
                success: true,
                messages:user[0].messages, 
            },
            { status:203 }
        )
        
    } catch (error) {
        return Response.json(
            {
                success: false,
                message: "Failed get messages"
            },
            { status:500 }
        )
    }
}