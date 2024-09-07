import mongoose, { Schema, Document } from "mongoose";
import { Message, messageSchema } from "./message.model";

export interface UserInterface extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isAcceptingMessage: boolean;
    messages: Message[];
}

const userSchema: Schema<UserInterface> = new Schema(
    {
        username: {
            type: String,
            required: [true, "Username is required"],
            trim: true,
            unique: true,
        },

        email: {
            type: String,
            required: [true, "Email is required"],
            trim: true,
            unique: true,
            match: [
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                "Please enter a valid email address",
            ],
        },

        password: {
            type: String,
            required: [true, "Password is required"],
        },

        verifyCode: {
            type: String,
            required: [true, "Verification Code is required"],
        },

        verifyCodeExpiry: {
            type: Date,
            required: [true, "Verification Code Expiry is required"],
        },

        isVerified: {
            type: Boolean,
            default: false,
        },

        isAcceptingMessage: {
            type: Boolean,
            default: true,
        },

        messages: [messageSchema],
    },
    { timestamps: true }
);

const User =
    (mongoose.models.User as mongoose.Model<UserInterface>) ||
    mongoose.model<UserInterface>("User", userSchema);

export default User;
