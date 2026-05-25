import {z} from "zod";
export const signupSchema=z.object(
    {
        email:z.string().email(),
        password:z.string().min(6),
    }
);
export const signinSchema=signupSchema;
export const resetSchema=z.object(
    {
        email:z.string().email(),
        code:z.string(),
        newPassword:z.string().min(6),
    }
);