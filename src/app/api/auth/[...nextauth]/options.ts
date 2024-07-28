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
                // console.log('credentials',credentials)
                try {
                    const user = await UserModel.findOne({
                        $or:[
                        { email: credentials.identifier },
                        { userName: credentials.identifier },
                    {new:true, }]
                    }).sort({createdAt:-1});
                    if (!user) {
                        throw new Error('No user found with this identifier');
                      }
                      if (!user.isVerified) {
                        throw new Error('Please verify your account before signin');
                      }
                    if(user){
                        const isPasswordCorrect = await bcrypt.compare(credentials.password,user?.password);
                        if(isPasswordCorrect){
                            if(!user?.isVerified){
                                throw new Error("User is not verified");
                            }
                            // console.log('returning User....')
                            return user
                        }else{
                            throw new Error("Invalid Password");
                        }
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
                // console.log('token:',token)
                token._id = user._id?.toString();
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.userName;
            }
            return token
        },
        async session({ session, token }) {
            if(token){
                session.user._id =  token._id;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessages = token.isAcceptingMessages;
                session.user.username = token.username;
                // console.log('session:',session)
            }
            return session
          },
    },
    session:{
        strategy: 'jwt',
        // maxAge:1, // 1 hour in seconds
    },
    secret:process.env.NEXTAUTH_SECRET,
    pages:{
        signIn:'/sign-in',
    },
}