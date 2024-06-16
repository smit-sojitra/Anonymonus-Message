import {z} from "zod";

export const acceptMessageSchema = z.object({
    acceptMeessages: z.boolean(),
});

