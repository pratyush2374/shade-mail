import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import connectToDB from "@/lib/dbConnection";
import User from "@/model/user.model";
import { User as NextUser } from "next-auth";

export async function POST(request: Request) {
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

    const userId = user._id;
    const { acceptMessage } = await request.json();

    try {
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { isAcceptingMessage: true },
            { new: true }
        );

        if (!updatedUser) {
            return Response.json(
                {
                    success: false,
                    message:
                        "Failed to update user status to accept message, in DB",
                },
                { status: 401 }
            );
        }

        return Response.json(
            {
                success: true,
                message: "User can now accept messages",
                updatedUser,
            },
            { status: 200 }
        );
    } catch (error) {
        console.log("Failed to update user status to accept message");

        return Response.json(
            {
                success: false,
                message: "Failed to update user status to accept message",
            },
            { status: 500 }
        );
    }
}

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

    const userId = user._id;

    try {
        const foundUser = await User.findById(userId);

        if (!foundUser) {
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
                isAcceptingMessage: foundUser.isAcceptingMessage,
            },
            { status: 404 }
        );
    } catch (error) {
        console.error(
            "Error while getting user message acceptance status ",
            error
        );
        return Response.json(
            {
                success: false,
                message: "Error while getting user message acceptance status",
            },
            { status: 500 }
        );
    }
}
