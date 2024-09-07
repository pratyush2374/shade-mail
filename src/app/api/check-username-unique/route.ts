import connectToDB from "@/lib/dbConnection";
import User from "@/model/user.model";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUp.schema";

const usernameQuerySchema = z.object({
    username: usernameValidation,
});

export async function GET(request: Request) {
    
    await connectToDB();

    try {
        const { searchParams } = new URL(request.url);
        const queryParam = {
            username: searchParams.get("username"),
        };

        //validating with zod
        const validUsername = usernameQuerySchema.safeParse(queryParam);

        /*
            console.log(validUsername); 

            The above console log gives this 
            { success: true, data: { username: 'pratyush2374' } }
        */

        if (!validUsername.success) {
            const userNameError =
                validUsername.error.format().username?._errors || [];
            return Response.json(
                {
                    success: false,
                    message:
                        userNameError?.length > 0
                            ? userNameError.join(", ")
                            : "Invalid quesry parameters",
                },
                { status: 400 }
            );
        }

        const { username } = validUsername.data;
        const existingVerifiedUser = await User.findOne({
            username,
            isVerified: true,
        });

        if (existingVerifiedUser) {
            return Response.json(
                {
                    success: false,
                    message: "Username already taken",
                },
                {
                    status: 401,
                }
            );
        }

        return Response.json(
            {
                success: true,
                message: "Username available",
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        console.error("Error checking user ", error);
        return Response.json(
            {
                success: false,
                message: "Error while checking username",
            },
            {
                status: 500,
            }
        );
    }
}
