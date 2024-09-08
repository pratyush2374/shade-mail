import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import connectToDB from "@/lib/dbConnection";
import User from "@/model/user.model";
import { User as NextUser } from "next-auth";
import mongoose from "mongoose";

export async function GET(request: Request) {
    await connectToDB();

    const session = await getServerSession(authOptions);

    const user: NextUser = session?.user as NextUser;

    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: "User is not authenticated",
            },
            { status: 401 }
        );
    }

    const userId = new mongoose.Types.ObjectId(user._id);

    try {
        const foundUser = await User.aggregate([
            {
                $match: { _id: userId },
            },
            {
                $unwind: "$messages",
            },
            {
                $sort: { "messages.createdAt": -1 },
            },
            {
                $group: { _id: "_id", messages: { $push: "$messages" } },
            },
        ]);

        if (!foundUser || foundUser.length === 0) {
            return Response.json(
                {
                    success: false,
                    message: "User not found",
                },
                { status: 404 }
            );
        }

        return Response.json(
            {
                success: true,
                messages: foundUser[0].messages,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error retrieving message: ", error);
        return Response.json(
            {
                success: false,
                message: "Error retrieving message",
            },
            { status: 500 }
        );
    }
}
