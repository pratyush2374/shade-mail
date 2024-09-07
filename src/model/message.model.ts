import mongoose, { Schema, Document } from "mongoose";

export interface Message {
    content: string;
}

export const messageSchema: Schema<Message> = new Schema(
    {
        content: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);
