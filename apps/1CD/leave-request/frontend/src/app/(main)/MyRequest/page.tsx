'use server';

import { getEmail } from '@/utils/get-email';
import SentRequest from '@/components/myreq/SentRequest';
import Requests from '@/components/myreq/Requests';
import { SecureWrapper } from '@/context/SecurePageWrapper';

const Page = async () => {
  const email = await getEmail();
  return (
    <SecureWrapper roles={['supervisor', 'supervisee', 'admin']}>
      <div data-cy="myRequest-page" className="mt-10">
        <Requests email={email} />
        <SentRequest email={email} />
      </div>
    </SecureWrapper>
  );
};

export default Page;
