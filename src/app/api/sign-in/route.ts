import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";

export async function POST(request:Request){
    await dbConnect();
    try {
        const {identifier,password} = await request.json();

        const existingUserByUsername = await UserModel.findOne({ userName:identifier }).sort({createdAt:-1});
        const existingUserByEmail = await UserModel.findOne({ email:identifier }).sort({createdAt:-1});
        const user = existingUserByUsername || existingUserByEmail;
        if (user) {
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if(!isPasswordValid){
                return  Response.json({
                    success:false,
                    message:'Password is incorrect'
                },{status:500})   
            }
            return  Response.json({
                success:true,
                message:'User signin successfully'
            },{status:200})
        }
    } catch (error) {
        console.log("Error while signing :-",error);
        return Response.json(
            {
                success: false,
                message: "Error while signing"
            },
            {
                status: 500
            }
        )
    }
}