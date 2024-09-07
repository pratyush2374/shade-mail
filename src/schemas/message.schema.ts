import { z } from "zod";

export const messageSchema = z.object({
    message: z
        .string()
        .min(5, { message: "Message should be more than 5 characters" })
        .max(500, { message: "Message cannot be greater than 500 characters" }),
});
