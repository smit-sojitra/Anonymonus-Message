import mongoose ,{Schema, Document} from "mongoose";

export interface Message extends Document{
    content:string;
    createdAt:Date;
}

const MessageSchema:Schema<Message> = new Schema({
    content:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        required:true,
        default:Date.now(),
    }
})

export interface User extends Document{
    userName:string;
    email:string;
    password:string;
    verifyCode:string;
    verifyCodeExpiry:Date;
    isVerified:boolean;
    isAcceptingMessage:boolean;
    messages:Message[];
    createdAt:Date;
}

const UserSchema:Schema<User> = new Schema({
    userName:{
        type:String,
        required:[true,'UserName is required'],
        trim:true,
    },
    email:{
        type:String,
        required:[true,'Email is required'],
        match:[/.+\@.+\..+/,'please use a valid email address'],
        unique:true,
    },
    password:{
        type:String,
        required:[true,'Password is required'],
    },
    verifyCode:{
        type:String,
        required:[true,'verifyCode is required'],
    },
    verifyCodeExpiry:{
        type:Date,
        required:[true,'verifyCodeExpiry is required'],
    },
    isVerified:{
        type:Boolean,
        default:false,
    },
    isAcceptingMessage:{
        type:Boolean,
        default:true,
    },
    createdAt:{
        type:Date,
        required:true,
        default:Date.now()
    },
    messages:[MessageSchema]
});

const UserModel = (mongoose.models.User as mongoose.Model<User>) || ( mongoose.model<User>('User',UserSchema));
export default UserModel;