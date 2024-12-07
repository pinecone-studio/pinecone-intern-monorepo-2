'use client';

import Requests from '@/components/myreq/Requests';
import SentRequest from '@/components/myreq/SentRequest';
import UserHeader from '@/components/myreq/UserHeader';

const Page = () => {
  return (
    <div data-cy="myRequest-page">
      <UserHeader />
      <Requests />
      <SentRequest />
    </div>
  );
};

export default Page;
