import { PropsWithChildren } from 'react';
import { ApolloWrapper, AuthProvider } from '../../components/providers';
import { ToastContainer } from 'react-toastify';

const MainLayout = ({ children }: PropsWithChildren) => {
  return (
    <ApolloWrapper>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <div className="flex-1">{children}</div>
        </div>
        <ToastContainer />
      </AuthProvider>
    </ApolloWrapper>
  );
};

export default MainLayout;
