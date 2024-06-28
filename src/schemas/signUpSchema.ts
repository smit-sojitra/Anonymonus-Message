import {z} from "zod";

export const userNameValidation = z
        .string()
        .min(4,"UserName must have at least 4 characters")
        .max(10,"Username can't be longer than 20 characters.")
        .regex(/^[a-zA-Z0-9]+$/,'Username can only contain letters and numbers.')
export const signUpschema = z.object({
    userName:userNameValidation,
    email:z.string().email({message:'Please enter a valid email address'}),
    password:z.string().min(6,"Password must have at least 6 characters").max(10,"Password can't be longer than 10 characters.")
    .regex(/[^a-zA-Z0-9\s]/,"Password must have at least one special character")
    .regex(/[A-Z]/,'Password must have at least one uppercase letter')
    .regex(/[a-z]/,'Password must have at least one lowercase letter')
    .regex(/[0-9]/,'Password must have at least one number')

})
