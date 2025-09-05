'use client';

import { SignupProvider, SignupContainer } from '@/components/profile';

const Page = () => {
  return (
    <SignupProvider userId="68a7f8d00985f14515de4be0">
      <SignupContainer />
    </SignupProvider>
  );
};

Page.displayName = 'Page';

export default Page;
