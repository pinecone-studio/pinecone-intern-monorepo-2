import { PropsWithChildren } from 'react';
import '.././global.css';
import { AuthProvider, SignupProvider } from '@/components/providers';

const UserLayout = ({ children }: PropsWithChildren) => {
  return (
    <AuthProvider>
      <SignupProvider>{children}</SignupProvider>
    </AuthProvider>
  );
};

export default UserLayout;
