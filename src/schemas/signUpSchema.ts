import {z} from "zod";

export const userNameValidation = z
        .string()
        .min(4,"User must have at least 4 characters")
        .max(20, "Username can't be longer than 20 characters.")
        .regex(/^[a-zA-Z0-9]+$/,'Username can only contain letters and numbers.') // regex for username validation (only letters 
export const signUpschema = z.object({
    userName:userNameValidation,
    email:z.string().email({message:'Please enter a valid email address'}),
    password:z.string().min(4,"Password must have at least 4 characters").max(10,"Password can'nt be longer than 10 characters.")
})
