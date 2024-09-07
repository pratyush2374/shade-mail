import { z } from "zod";

export const acceptMessageSchema = z.object({
    isAcceptingMessages: z.boolean(),
});
