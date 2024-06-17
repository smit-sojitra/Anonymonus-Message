import 'next-auth'
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
    interface User{
        _id?: string;
        isVerified?: boolean;
        username?: string;
        isAcceptingMessages?: boolean;
    }
    interface Session{
        user:{
            _id?: string;
            isVerified?: boolean;
            username?: string;
            isAcceptingMessages?: boolean;
        } & DefaultSession['user']
    }
}

declare module 'next-auth/jwt'{
    interface User{
        _id?: string;
        isVerified?: boolean;
        username?: string;
        isAcceptingMessages?: boolean;
    }
}