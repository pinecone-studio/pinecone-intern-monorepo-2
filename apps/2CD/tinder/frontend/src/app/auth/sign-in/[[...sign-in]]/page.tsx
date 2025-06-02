"use client";

import { SignIn } from "@clerk/nextjs";

const SignInPage = () => {
    return (
        <div className="flex justify-center items-center min-h-screen bg-[#EEEEEE]">
            <SignIn
                routing="hash"
                signUpUrl="/auth/sign-up"
                afterSignUpUrl={"/swipe"}
                forceRedirectUrl={"/swipe"}
            />
        </div>
    );
};

export default SignInPage;