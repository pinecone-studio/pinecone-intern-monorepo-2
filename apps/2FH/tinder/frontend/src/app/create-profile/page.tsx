'use client';

import { SignupProvider, SignupContainer } from '@/components/profile';

const Page = () => {
  return (
    <SignupProvider userId="68b67dd07ffee9b8ca1fe95b">
      <SignupContainer />
    </SignupProvider>
  );
};

export default Page;
