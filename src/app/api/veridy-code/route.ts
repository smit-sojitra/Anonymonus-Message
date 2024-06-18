import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request:Request){
    await dbConnect();
    try {
        const {username,code} = await request.json();
        const decodedUsername = decodeURIComponent(username);
        const user = await UserModel.findOne({userName:decodedUsername});
        if(!user){
            return Response.json(
                {
                    success:false,
                    message:'User not found'
                },{
                    status:500
                }
            )
        }
        const isCodeValid = user.verifyCode === code;
        const isCodeNotExpierd = new Date(user.verifyCodeExpiry) > new Date()
        if(isCodeNotExpierd && isCodeNotExpierd){
            user.isVerified = true;
            await user.save();
            return Response.json(
                {
                    success:true,
                    message:'Account verified successfully'
                },{
                    status:200
                }
            )
        }else if(!isCodeNotExpierd){
            return Response.json(
                {
                    success:false,
                    message:'Verification code expired,Please signup again to get ne code'
                },{
                    status:500
                }
            )
        }else{
            return Response.json(
                {
                    success:false,
                    message:'Incorrect verification code'
                },{
                    status:500
                }
            )
        }
    } catch (error) {
        return Response.json(
            {
                success:false,
                message:'User not found'
            },{
                status:500
            }
        )
    }
}