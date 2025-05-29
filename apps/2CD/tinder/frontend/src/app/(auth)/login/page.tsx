"use client"

import { SignIn } from "@clerk/nextjs";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";




const  Login = ()=>  {
    const { isSignedIn } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isSignedIn) {
            router.push('/');
        }
    }, [isSignedIn, router]);
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg ">
                <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
                    Sign In
                </h1>
                <div className="flex justify-center">
                    <SignIn
                        path="/login"
                        routing="path"
                        signUpUrl="/sign-up"
                        afterSignInUrl="/"
                    />

                </div>
            </div>
        </div>
    );
}

export default Login;