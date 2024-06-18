import dbConnect from "@/lib/dbConnect";
import {z} from "zod"
import UserModel from "@/model/User";
import { userNameValidation } from "@/schemas/signUpSchema";

const UsernameQueryschema = z.object({
    username: userNameValidation
})

export async function GET(request:Request){
    await dbConnect();
    try {
        const {searchParams} = new URL(request.url);
        // console.log("searchParams",searchParams); Test
        const queryParams = {
            username: searchParams.get('username')
        }
        // validate with zod
        const result = UsernameQueryschema.safeParse(queryParams);
        // console.log("Result:-",result)  Test
        if(!result.success){
            const usernameErrors = result.error.format().username?._errors || [] 
            return Response.json({
                success:false,
                message:usernameErrors.length >0 ?
                usernameErrors.join(', ') :"Invalid query parameters"
            },{status:500})
        }
        const {username} = result.data;
        const existinfVerifiedUser = await UserModel.findOne({userName:username,isVerified:true});
        if(existinfVerifiedUser){
            return Response.json({
                success:false,
                message:'UserName is already taken'
            },{status:500})
        }
        return Response.json({
            success:true,
            message:'UserName is unique'
        },{status:200})
    } catch (error) {
        return Response.json({
            success:false,
            message:'Error checking userName'
        },{status:500})
    }
}