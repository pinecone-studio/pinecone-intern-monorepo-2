'use client';

import { UserDetailsProvider } from '@/components/providers/UserDetailsProvider';
import { Userdetails } from '@/components/Userdetails';


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
