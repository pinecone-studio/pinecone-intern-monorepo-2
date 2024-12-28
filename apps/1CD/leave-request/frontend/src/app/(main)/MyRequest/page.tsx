"use server"

import { getEmail } from '@/utils/get-email';
import SentRequest from '@/components/myreq/SentRequest';
import Requests from '@/components/myreq/Requests';

const Page = async() => {
  const email = await getEmail()
  return (
    <div data-cy="myRequest-page" className='mt-10'>
      <Requests email={email}/>
      <SentRequest email={email}/>
    </div>
  );
};


export default Page;
