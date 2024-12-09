import { getEmail } from '@/utils/get-email';
import { CreateNewRequest } from './CreateNewRequest';

const Page = () => {
  getEmail()
  return <CreateNewRequest />;
};

export default Page;
