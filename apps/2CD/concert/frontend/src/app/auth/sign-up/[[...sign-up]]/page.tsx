'use client';

import { SignUp } from '@clerk/nextjs';

const SignUpPage = () => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <SignUp path="/auth/sign-up" />
    </div>
  );
};

export default SignUpPage;
