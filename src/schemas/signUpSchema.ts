import {z} from "zod";

export const userNameValidation = z
        .string()
        .min(4,"User must have at least 4 characters")
        .max(10,"Username can't be longer than 20 characters.")
        .regex(/^[a-zA-Z0-9]+$/,'Username can only contain letters and numbers.') // regex for username validation (only letters 
export const signUpschema = z.object({
    userName:userNameValidation,
    email:z.string().email({message:'Please enter a valid email address'}),
    password:z.string().min(4,"Password must have at least 4 characters").max(10,"Password can'nt be longer than 10 characters.")
    // .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}$/,'Password must have one uppercase letter, one lowercase letter ,one special character and one digit.')
    .regex(/[^a-zA-Z0-9\s]/,"Password must have at least one special character")
    .regex(/[A-Z]/,'Password must have at least one uppercase letter')
    .regex(/[a-z]/,'Password must have at least one lowercase letter')
    .regex(/[0-9]/,'Password must have at least one number')

})
