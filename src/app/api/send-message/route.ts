import connectToDB from "@/lib/dbConnection";
import User from "@/model/user.model";
import Message, { MessageInterface } from "@/model/message.model";

export async function POST(request: Request) {
    await connectToDB();

    const { username, content } = await request.json();

    try {
        const foundUser = await User.findOne({ username });
        if (!foundUser) {
            return Response.json(
                {
                    success: false,
                    message: "User not found",
                },
                { status: 404 }
            );
        }

        //If user found then we'll check if the user is accepting messages
        if (!foundUser.isAcceptingMessage) {
            return Response.json(
                {
                    success: false,
                    message: "User not accepting messages",
                },
                { status: 403 } //forbidden
            );
        }

        const newMessage = new Message({ content, createdAt: new Date() });

        foundUser.messages.push(newMessage);

        await foundUser.save();

        return Response.json(
            {
                success: true,
                message: "Message sent successfully",
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error sending message: ", error);
        return Response.json(
            {
                success: false,
                message: "Error sending message",
            },
            { status: 500 }
        );
    }
}
