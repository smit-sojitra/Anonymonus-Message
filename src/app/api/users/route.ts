import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { authOptions } from "../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";

export async function GET(request:Request){
    await dbConnect();
    try {
        const session = await getServerSession(authOptions);
        const user = session?.user;
        if(!session || !user){
            return Response.json(
                {
                    success:false,
                    message:"Not authenticated ,Please sign in again"
                },
                {status:500}
            )
        }
        console.log('user',user);
        const TotalUsers = await UserModel.find({});
        // console.log('totalUsers',TotalUsers)
        const users = TotalUsers.filter((u)=>(u.id !== user._id))
        if(!users){
            return Response.json(
                {
                    success:false,
                    message:"There are no users"
                },
                {status:500}
            )
        }else{
            return Response.json(
                {
                    success:true,
                    message:users,
                    total:TotalUsers,
                },
                {status:200}
            )
        }
    } catch (error) {
        console.log('Error while fetching users',error)
        return Response.json(
            {
                success:false,
                message:"Not authenticated ,Please sign in again"
            },
            {status:500}
        )
    }
}