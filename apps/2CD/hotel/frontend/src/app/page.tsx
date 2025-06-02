'use client';
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
const Page = () => {
  return (
    <>
      <header className="flex justify-end items-center p-4 gap-4 h-16">
        <SignedOut>
          <div className="p-2 bg-green-500 rounded-lg">
            <SignInButton />
          </div>
          <div className="p-2 bg-blue-500 rounded-lg">
            <SignUpButton />
          </div>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </header>
    </>
  );
};

export default Page;
