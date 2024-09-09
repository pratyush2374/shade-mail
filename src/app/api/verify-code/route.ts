import connectToDB from "@/lib/dbConnection";
import User from "@/model/user.model";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUp.schema";
import { verifySchema, verifySchemaNO } from "@/schemas/verify.schema";

export async function POST(request: Request) {
    await connectToDB();

    const verifyCodeQuerySchema = z.object({
        username: usernameValidation,
        code: verifySchemaNO,
    });

    try {
        const { username, code } = await request.json();

        const validRequest = verifyCodeQuerySchema.safeParse({
            username,
            code,
        });

        if (!validRequest.success) {
            return Response.json(
                {
                    success: false,
                    message: "Incorrect code or username 1st",
                },
                {
                    status: 400,
                }
            );
        }
        const decodedUsername = decodeURIComponent(username);

        const userInDB = await User.findOne({ username: decodedUsername });

        if (!userInDB) {
            return Response.json(
                {
                    success: false,
                    message: "No user found",
                },
                {
                    status: 404,
                }
            );
        }

        const isCodeValid = userInDB.verifyCode === code;
        const isCodeNotExpired =
            new Date(userInDB.verifyCodeExpiry) > new Date();

        if (isCodeValid && isCodeNotExpired) {
            userInDB.isVerified = true;
            await userInDB.save();

            return Response.json(
                {
                    success: true,
                    message: "User verified",
                },
                {
                    status: 200,
                }
            );
        } else if (!isCodeNotExpired) {
            return Response.json(
                {
                    success: false,
                    message: "Verification Code Expired",
                },
                {
                    status: 400,
                }
            );
        } else {
            return Response.json(
                {
                    success: false,
                    message: "Incorrect Verification Code",
                },
                {
                    status: 400,
                }
            );
        }
    } catch (error) {
        console.error("Error verifying code ", error);
        return Response.json(
            {
                success: false,
                message: "Error verifying code",
            },
            {
                status: 500,
            }
        );
    }
}
