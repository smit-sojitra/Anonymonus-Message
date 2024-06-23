import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { authOptions } from "../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { User } from "next-auth";

export async function POST(request:Request){
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
    const userId = user._id;
    const {acceptMessages} = await request.json();
    try {
        const updatedUser = await UserModel.findByIdAndUpdate(userId,{isAcceptingMessage:acceptMessages},{new:true});
        if(!updatedUser){
            return Response.json(
                {
                    success: false,
                    message: "Failed to upadete user message status"
                },
                { status:500 }
            )
        }
        return Response.json(
            {
                success: true,
                message: "Message status updated succesfully",
                updatedUser
            },
            { status:200 }
        )
        
    } catch (error) {
        return Response.json(
            {
                success: false,
                message: "Failed to upadete user message status"
            },
            { status:500 }
        )
    }
}
export async function GET(request:Request){
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user:User = session?.user;
    // console.log('Accept  messages session',user)
    if(!session || !session.user){
        return Response.json(
            {
                success: false,
                message: "Not Authenticated"
            },
            { status:500 }
        )
    }

    try {
        const foundUser = await UserModel.findById({_id:user._id});
        if(!foundUser){
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                },
                { status:404 }
            )
        }
        return Response.json(
            {
                success: true,
                message: "Message status updated succesfully",
                isAcceptingMessages:foundUser.isAcceptingMessage,
            },
            { status:200 }
        )
        
    } catch (error) {
        return Response.json(
            {
                success: false,
                message: "Failed to fetch user message status"
            },
            { status:500 }
        )
    }
}
