import { MessageInterface } from "@/model/message.model";

export interface ApiResponse {
    success: boolean;
    message: string;
    isAcceptingResponses?: boolean;
    messages?: Array<MessageInterface>;
}
