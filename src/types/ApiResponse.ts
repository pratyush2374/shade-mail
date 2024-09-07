import { Message } from "@/model/message.model";

export interface ApiResponse {
    success: boolean;
    message: string;
    isAcceptingResponses?: boolean;
    messages?: Array<Message>;
}
