import { getEmail } from '@/utils/get-email';
import { CreateNewRequest } from './CreateNewRequest';
import { MessageContextWrapper } from '@/context/MessageContext';

const Page = async () => {
  const email = await getEmail();
  return (
    <MessageContextWrapper>
      <CreateNewRequest email={email} />
    </MessageContextWrapper>
  );
};

export default Page;
