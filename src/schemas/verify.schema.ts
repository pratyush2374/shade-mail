import { z } from "zod";

export const verifySchema = z.object({
    verificationCode: z
        .string()
        .length(6, { message: "Verification code is of 6 digits" }),
});
