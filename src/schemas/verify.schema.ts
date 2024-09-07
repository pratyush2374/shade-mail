import { z } from "zod";

export const verifySchema = z
    .string()
    .length(6, { message: "Verification code is of 6 digits" });
