"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signInSchema } from "@/schemas/signIn.schema";
import { signIn } from "next-auth/react";

const SignIn = () => {
    const { toast } = useToast();
    const router = useRouter();

    //zod implementation
    const register = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
    });

    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
        const result = await signIn("credentials", {
            redirect: false,
            identifier: data.identifier,
            password: data.password,
        });
        //TODO: console log "result"

        console.log(result);
        if (result?.error) {
            toast({
                title: "Error Signing In",
                description: "Incorrect username or password",
                variant: "destructive",
            });
        }

        if (result?.url) {
            router.replace("/dashboard");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-800">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Join True Feedback
                    </h1>
                    <p className="mb-4">
                        Sign in to start your anonymous adventure
                    </p>
                </div>

                <Form {...register}>
                    <form
                        onSubmit={register.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        {/* For email */}
                        <FormField
                            name="identifier"
                            control={register.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Email" {...field} />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* for password */}
                        <FormField
                            name="password"
                            control={register.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="Password"
                                            {...field}
                                        />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Sign In</Button>
                    </form>
                </Form>
                <div className="text-center mt-4">
                    <p>
                        Not a member?{" "}
                        <Link
                            href="/sign-up"
                            className="text-blue-600 hover:text-blue-800"
                        >
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignIn;
