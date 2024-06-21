import {z} from "zod";

export const verifySchema = z.object({
    code:z.string().min(1,"Required").length(6,"Code must be 6 characters long"),
    
});

