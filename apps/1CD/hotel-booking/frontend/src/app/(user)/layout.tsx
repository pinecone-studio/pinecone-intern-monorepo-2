import { PropsWithChildren } from 'react';
import '.././global.css';
import { AuthProvider, SignupProvider } from '@/components/providers';
import { UpdateProvider } from '@/components/providers/UpdateUserProvider';
import { ToastContainer } from 'react-toastify';

const UserLayout = ({ children }: PropsWithChildren) => {
  return (
    <AuthProvider>
      <ToastContainer />
      <SignupProvider>
        <UpdateProvider>{children}</UpdateProvider>
      </SignupProvider>
    </AuthProvider>
  );
};

export default UserLayout;
