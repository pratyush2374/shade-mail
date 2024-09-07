import User from "@/model/user.model";
import connectToDB from "@/lib/dbConnection";
import bcrypt from "bcryptjs";
import sendVerificationEmail from "@/helper/sendverificationEmail";

export const POST = async (request: Request) => {
    await connectToDB();

    try {
        const { username, email, password } = await request.json();

        const existingUserVerifiedByUsername = await User.findOne({
            username,
            isVerified: true,
        });

        if (existingUserVerifiedByUsername) {
            return Response.json(
                { success: false, message: "User already exists" },
                { status: 400 }
            );
        }

        const existingUserByEmail = await User.findOne({ email });
        const verifyCode = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        if (existingUserByEmail) {
            //If user exists by email in the database then
            if (existingUserByEmail.isVerified) {
                return Response.json(
                    {
                        success: false,
                        message: "User already exists, please login",
                    },
                    { status: 400 }
                );
            } else {
                // If user exists by email but is not verified then
                const hashedPassword = await bcrypt.hash(password, 10);

                //updating the password
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(
                    Date.now() + 3600000
                );

                await existingUserByEmail.save();
            }
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);

            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            const newUser = new User({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: [],
            });

            await newUser.save();
        }

        //Sending verification email
        const emailResponse = await sendVerificationEmail(
            email,
            username,
            verifyCode
        );

        //If email was not sent
        if (!emailResponse.success) {
            return Response.json(
                {
                    success: false,
                    message: `Error while sending verification email Error ${emailResponse.message}`,
                },
                { status: 500 }
            );
        }

        return Response.json(
            {
                success: true,
                message:
                    "User registration successfull & verification email sent",
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error registering user ", error);
        return Response.json(
            {
                success: false,
                message: "Error registering user",
            },
            {
                status: 500,
            }
        );
    }
};
