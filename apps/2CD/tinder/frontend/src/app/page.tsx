'use client';

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const LandingPage = () => {
  const { isSignedIn, user } = useUser();
  const router = useRouter();

  return (
    <div className="p-6">
      {isSignedIn ? (
        <div>
          <div className="mb-4">Welcome back, {user.firstName}!</div>
          <button onClick={() => router.push('/profile')}>
            Go to Profile
          </button>
          <button className="bg-red" onClick={() => router.push(`/message`)}>Chat</button>
        </div>
      ) : (
        <div>
          <div className="mb-4">Landing page.</div>
          <button onClick={() => router.push(`/auth/sign-in`)}>Sign In</button>
          <button onClick={() => router.push(`/auth/sign-up`)}>Sign Up</button>
        </div>

      )}
    </div>
  );
}

export default LandingPage;