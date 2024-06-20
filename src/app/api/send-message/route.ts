import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User";

export async function POST(request:Request){
    await dbConnect();
    const {username,content} = await request.json()
    try {
        const user = await UserModel.findOne({ userName:username });
        if(!user){
            return Response.json(
                {
                    success: false,
                    message: "User mot found"
                },
                { status:404 }
            )
        }
        const isUserAcceptingMessages = user.isAcceptingMessage;
        if(!isUserAcceptingMessages){
            return Response.json(
                {
                    success: false,
                    message: "User not accepting messages"
                },
                { status:500 }
            )
        }
        const newMessage = {content,createdAt:new Date()};
        user.messages.push(newMessage as Message)
        await user.save()
        return Response.json(
            {
                success: true,
                message: "Message sent successfully"
            },
            { status:200 }
        )
    } catch (error) {
        return Response.json(
            {
                success: false,
                message: "Failed send message"
            },
            { status:500 }
        )
    }
}