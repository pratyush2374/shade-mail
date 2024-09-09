"use client";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { verifySchema } from "@/schemas/verify.schema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const VerifyAccount = () => {
    const router = useRouter();
    const params = useParams<{ username: string }>();
    const { toast } = useToast();

    //zod implementation
    const register = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
    });

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        try {
            const response = await axios.post("/api/verify-code", {
                username: params.username,
                code: data.verificationCode,
            });

            toast({
                title: "Verification Successfull",
                description: response.data.message,
            });

            router.replace("/sign-in");
        } catch (error) {
            console.error("Error while verifying code ", error);
            const axiosError = error as AxiosError<ApiResponse>;
            let errorMessage =
                axiosError.response?.data.message ??
                "Error while verifying code";
            toast({
                variant: "destructive",
                title: "Verification Failed",
                description: errorMessage,
            });
        }
    };

    return (
        <>
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                    <div className="text-center">
                        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                            Verify Your Account
                        </h1>
                        <p className="mb-4">
                            Enter the verification code sent to your email
                        </p>
                    </div>

                    <Form {...register}>
                        <form
                            onSubmit={register.handleSubmit(onSubmit)}
                            className="space-y-6"
                        >
                            <FormField
                                name="verificationCode"
                                control={register.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Verification Code</FormLabel>
                                        <Input {...field} />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit">Verify</Button>
                        </form>
                    </Form>
                </div>
            </div>
        </>
    );
};

export default VerifyAccount;
