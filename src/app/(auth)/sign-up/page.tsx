"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUp.schema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
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
import { LucideLoader2 } from "lucide-react";

const page = () => {
    const [username, setUsername] = useState("");
    const [usernameMessage, setUsernameMessage] = useState("");
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const debounced = useDebounceCallback(setUsername, 500);

    const { toast } = useToast();
    const router = useRouter();

    //zod implementation
    const register = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
        },
    });

    //Use effect to check if username is unique or not using devbounced value
    useEffect(() => {
        const checkUsernameUnique = async () => {
            if (username) {
                setIsCheckingUsername(true);
                setUsernameMessage(""); //cleanup for last request
                try {
                    const response = await axios.get(
                        `/api/check-username-unique?username=${username}`
                    );
                    //TODO: console log and see the response object of axios response
                    setUsernameMessage(response.data.message);
                } catch (error) {
                    //casting error as axios error
                    const axiosError = error as AxiosError<ApiResponse>;
                    setUsernameMessage(
                        axiosError.response?.data.message ??
                            "Error checking username"
                    );
                } finally {
                    setIsCheckingUsername(false);
                }
            }
        };

        checkUsernameUnique();
    }, [username]);

    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        setIsSubmitting(true);
        try {
            //TODO: console log "data"
            const response = await axios.post<ApiResponse>(
                "/api/sign-up",
                data
            );

            //after request giving toast
            if (response.data.success) {
                //if registeration was successfull
                toast({
                    title: "Success",
                    description: response.data.message,
                });

                //Move to route
                router.replace(`/verify/${username}`);
            } else {
                //if registeration fails
                toast({
                    variant: "destructive",
                    title: "Registration Failed",
                    description: response.data.message,
                });
            }
        } catch (error) {
            console.error("Error while signing up ", error);
            const axiosError = error as AxiosError<ApiResponse>;
            let errorMessage = axiosError.response?.data.message;
            toast({
                variant: "destructive",
                title: "Signup Failed",
                description: errorMessage,
            });
        } finally {
            setIsSubmitting(false);
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
                        Sign up to start your anonymous adventure
                    </p>
                </div>

                <Form {...register}>
                    <form
                        onSubmit={register.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        {/* For username */}
                        <FormField
                            name="username"
                            control={register.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Username"
                                            {...field}
                                            //assigning val to field
                                            onChange={(e) => {
                                                field.onChange(e);
                                                debounced(e.target.value);
                                            }}
                                        />
                                    </FormControl>
                                    {isCheckingUsername && (
                                        <LucideLoader2 className="animate-spin" />
                                    )}
                                    <p
                                        className={`text-sm ${
                                            usernameMessage ===
                                            "Username available"
                                                ? "text-green-500"
                                                : "text-red-500"
                                        }`}
                                    >
                                        {usernameMessage}
                                    </p>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* For email */}
                        <FormField
                            name="email"
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
                        <Button type="submit" disabled={isSubmitting}>
                            {/* Manipulating button */}
                            {isSubmitting ? (
                                <>
                                    <LucideLoader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                                    Please Wait
                                </>
                            ) : (
                                "Sign Up"
                            )}
                        </Button>
                    </form>
                </Form>
                <div className="text-center mt-4">
                    <p>
                        Already a member?{" "}
                        <Link
                            href="/sign-in"
                            className="text-blue-600 hover:text-blue-800"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default page;
