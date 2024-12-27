import Requests from '@/components/supervisor/Requests';
import { getEmail } from '@/utils/get-email';

import React from 'react';

const SupervisorPage = async() => {
  const email = await getEmail()
  return (
    <>
      <Requests email={email}/>
    </>
  );
};

export default SupervisorPage;
