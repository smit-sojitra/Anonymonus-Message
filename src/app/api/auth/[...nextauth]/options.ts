import { NextAuthOptions } from "next-auth";
import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import bcrypt from "bcryptjs"
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions:NextAuthOptions = {
    providers:[
        CredentialsProvider({
            id:"credentials",
            name:"Credentials",
            credentials: {
                email: { label: "Email  ", type: "text" },
                password: { label: "Password", type: "password" }
              },
              async authorize(credentials:any):Promise<any> {
                await dbConnect()
                try {
                    const user = await UserModel.findOne({
                        $or:[
                        // { email: credentials.email },
                        // { username: credentials.username }]
                        { email: credentials.identifier },
                        { username: credentials.identifier }]
                    })
                    if(!user){
                        throw new  Error("User not found with this email");
                    }
                    if(!user.isVerified){
                        throw new Error("User is not verified");
                    }
                    const isPasswordCorrect = await bcrypt.compare(credentials.password,user.password);
                    if(isPasswordCorrect){
                        return user
                    }else{
                        throw new Error("Invalid Password");
                    }
                } catch (error:any) {
                    throw new  Error(error);
                }
              }
        })
    ],
    callbacks:{
        async jwt({ token, user}) {
            if(user){
                console.log('token:',token)
                token._id = user._id?.toString();
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.username;
            }
            return token
        },
        async session({ session, token }) {
            if(token){
                console.log('token:',token)
                session.user._id =  token._id;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessages = token.isAcceptingMessages;
                session.user.username = token.username;
            }
            return session
          },
    },
    pages:{
        signIn:'/sing-in',
    },
    session:{
        strategy:"jwt",
        // maxAge:1, // 1 hour in seconds
    },
    secret:process.env.NEXTAUTH_SECRET,
    
}