'use client';

import { useOtpContext } from '@/components';

const Page = () => {
  const { me } = useOtpContext();

  console.log('Current user:', me);

  return <div className="flex justify-between w-[1280px]">Home page</div>;
};

export default Page;
