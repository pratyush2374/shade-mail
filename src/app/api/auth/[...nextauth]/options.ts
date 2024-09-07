import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectToDB from "@/lib/dbConnection";
import bcrypt from "bcryptjs";
import User from "@/model/user.model";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "credentails",

            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },

            async authorize(credentails: any): Promise<any> {
                await connectToDB();

                try {
                    const user = await User.findOne({
                        $or: [
                            { email: credentails.identifier.email },
                            { username: credentails.identifier.name },
                        ],
                    });

                    if (!user) {
                        throw new Error("No user found with this email");
                    }

                    if (!user.isVerified) {
                        throw new Error(
                            "User not verified, try signing-up again"
                        );
                    }

                    const isPasswordCorrect = await bcrypt.compare(
                        credentails.password,
                        user.password
                    );

                    if (isPasswordCorrect) {
                        return user;
                    } else {
                        throw new Error("Incorrect password");
                    }
                } catch (error: any) {
                    throw new Error(error);
                }
            },
        }),
    ],

    callbacks: {
        async jwt({ user, token }) {
            //Modfy token only if user exits
            if (user) {
                token._id = user._id?.toString();
                token.isVerfied = user.isVerified;
                token.username = user.username;
                token.isAcceptingMessage = user.isAcceptingMessage;
            }
            return token;
        },

        async session({ session, token }) {
            if (token) {
                session.user._id = token._id;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessage = token.isAcceptingMessage;
                session.user.username = token.username;
            }
            return session;
        },
    },

    pages: {
        signIn: "/sign-in",
    },

    session: {
        strategy: "jwt",
    },

    secret: process.env.NEXTAUTH_SECRET,
};
