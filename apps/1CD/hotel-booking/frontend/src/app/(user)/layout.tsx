import { PropsWithChildren } from 'react';
import '.././global.css';
import { AuthProvider, SignupProvider } from '@/components/providers';
import { UpdateProvider } from '@/components/providers/UpdateUserProvider';

const UserLayout = ({ children }: PropsWithChildren) => {
  return (
    <AuthProvider>
      <SignupProvider>
        <UpdateProvider>{children}</UpdateProvider>
      </SignupProvider>
    </AuthProvider>
  );
};

export default UserLayout;
