import { SignupCard } from '@/components/auth/signupCard';
import AlreadyHaveAnAcc from '@/components/auth/signupCard/AlreadyHaveAnAcc';

import React from 'react';

const SignupPage = () => {
  return (
    <div className="flex flex-col justify-center min-h-screen gap-2 bg-gray-50">
      <SignupCard />
      <AlreadyHaveAnAcc />
    </div>
  );
};

export default SignupPage;
