'use client';

import { SignUp } from '@clerk/nextjs';
import { dark } from '@clerk/themes';

const SignUpPage = () => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <SignUp
        path="/auth/sign-up"
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

export default SignUpPage;
