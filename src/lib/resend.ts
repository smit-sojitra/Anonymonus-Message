import { Resend } from "resend";

export const resend = new Resend(process.env.API_KEY);