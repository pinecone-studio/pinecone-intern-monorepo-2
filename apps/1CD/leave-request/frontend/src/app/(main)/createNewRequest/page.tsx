import { getEmail } from '@/utils/get-email';
import { CreateNewRequest } from './CreateNewRequest';

const Page = async () => {
  const email = await getEmail()
  return <CreateNewRequest email={email}/>;
};

export default Page;
