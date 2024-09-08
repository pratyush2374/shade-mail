import mongoose, { Schema, Document } from "mongoose";

export interface MessageInterface extends Document {
    content: string;
    createdAt: Date;
}

export const messageSchema: Schema<MessageInterface> = new Schema(
    {
        content: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

const Message =
    (mongoose.models.Message as mongoose.Model<MessageInterface>) ||
    mongoose.model<MessageInterface>("Message", messageSchema);

export default Message;
