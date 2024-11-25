import { ApolloWrapper } from '@/components/providers';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { PropsWithChildren, Suspense } from 'react';
import { ToastContainer } from 'react-toastify';

const MainLayout = ({ children }: PropsWithChildren) => {
  return (
    <Suspense>
      <ApolloWrapper>
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <div className="flex-1">{children}</div>
          </div>
          <ToastContainer />
        </AuthProvider>
      </ApolloWrapper>
    </Suspense>
  );
};

export default MainLayout;
