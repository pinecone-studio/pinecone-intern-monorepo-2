import { getEmail } from '@/utils/get-email';
import { CreateNewRequest } from '../../../components/createNewRequest/CreateNewRequest';
import { MessageContextWrapper } from '@/context/MessageContext';
import { SecureWrapper } from '@/context/SecurePageWrapper';

const Page = async () => {
  const email = await getEmail();
  return (
    <SecureWrapper roles={["supervisee", "supervisor", "admin"]}>
      <MessageContextWrapper>
        <CreateNewRequest email={email} />
      </MessageContextWrapper>
    </SecureWrapper>
  );
};

export default Page;
