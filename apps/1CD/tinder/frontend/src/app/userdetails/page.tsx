'use client';

import { UserDetailsProvider } from '@/components/providers/UserDetailsProvider';
import { Userdetails } from '@/components/userdetails';

const UserDetails = () => {
  return (
    <div>
      <UserDetailsProvider>
        <Userdetails />
      </UserDetailsProvider>
    </div>
  );
};

export default UserDetails;
