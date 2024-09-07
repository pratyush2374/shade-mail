import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

const sendVerificationEmail = async (
    email: string,
    username: string,
    otp: string
): Promise<ApiResponse> => {
    try {
        await resend.emails.send({
            from: "onboarding@resend.dev",
            to: email,
            subject: "Shade Mail | Verification Code",
            react: VerificationEmail({ username, otp }),
        });

        return {
            success: true,
            message: "Verification email sent successfully! ",
        };
    } catch (emailError) {
        console.log("Error sending email ", emailError);
        return { success: false, message: "Error sending email" };
    }
};

export default sendVerificationEmail;