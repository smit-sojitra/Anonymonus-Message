import {z} from "zod";

export const messageSchema = z.object({
    content:z.string()
    .min(10,{message:"Content must be at least of 10 characters"})
    .max(1000,{message:"Content can't be more than 1000 characters"})
});

