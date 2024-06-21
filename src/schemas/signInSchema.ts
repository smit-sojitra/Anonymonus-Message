import {z} from "zod";

export const signInSchema = z.object({
    identifier:z.string().min(1,'Enter username or email !!'),
    password:z.string().min(1,'Enter password !!'),
});

