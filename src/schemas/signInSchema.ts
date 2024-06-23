import {z} from "zod";

export const signInSchema = z.object({
    identifier:z.string().min(1,'Required'),
    password:z.string().min(1,'Required'),
});

