import Requests from '@/components/supervisor/Requests';
import { SecureWrapper } from '@/context/SecurePageWrapper';
import { getEmail } from '@/utils/get-email';

import React from 'react';

const SupervisorPage = async() => {
  const email = await getEmail()
  return (
    <SecureWrapper roles={["supervisor", "admin"]}>
      <Requests email={email}/>
    </SecureWrapper>
  );
};

export default SupervisorPage;
