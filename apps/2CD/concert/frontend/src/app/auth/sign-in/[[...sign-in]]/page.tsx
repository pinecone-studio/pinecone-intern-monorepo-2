'use client';

import { SignIn } from '@clerk/nextjs';
import { dark } from '@clerk/themes';

const SignInPage = () => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <SignIn
        path="/auth/sign-in"
        appearance={{
          baseTheme: dark,
          elements: {
            card: 'bg-[#0d0d0d] border border-[#222] shadow-lg rounded-xl',
            headerTitle: 'text-white',
            headerSubtitle: 'text-gray-400',
            formFieldLabel: 'text-white',
            formFieldInput: 'bg-[#1a1a1a] text-white border-[#333]',
            footerActionText: 'text-gray-400',
            footerActionLink: 'text-blue-400 hover:underline',
          },
        }}
      />
    </div>
  );
};

export default SignInPage;
