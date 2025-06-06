'use client';

import { SignIn } from '@clerk/nextjs';

const SignInPage = () => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <SignIn path="/auth/sign-in" />
    </div>
  );
};

export default SignInPage;
