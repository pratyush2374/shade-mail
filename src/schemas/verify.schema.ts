import { z } from "zod";

export const verifySchema = z.object({
    verificationCode: z
        .string()
        .length(6, { message: "Verification code is of 6 digits" }),
});

export const verifySchemaNO = z
    .string()
    .length(6, { message: "Verification code is of 6 digits" });
