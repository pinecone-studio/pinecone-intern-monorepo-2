"use client";

import { SignIn } from "@clerk/nextjs";

const SignInPage = () => {
    return (
        <div className="flex justify-center items-center min-h-screen bg-[#EEEEEE]">
            <SignIn
                routing="hash"
                signUpUrl="/auth/sign-up"
                afterSignUpUrl={"/"}
                forceRedirectUrl={"/"}
            />
        </div>
    );
};

export default SignInPage;