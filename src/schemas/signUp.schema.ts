import { z } from "zod";

export const usernameValidation = z
    .string()
    .min(2, "Username should be atleast 2 characters")
    .max(30, "Username cannot be more than 30 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "User name cannot have special characters");

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({ message: "Invalid email" }),
    password: z
        .string()
        .min(6, { message: "Password should be atleast 6 characters" }),
});
