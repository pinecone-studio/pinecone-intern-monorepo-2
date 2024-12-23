import { PropsWithChildren } from 'react';
import { ApolloWrapper, AuthProvider } from '../../components/providers';

const MainLayout = ({ children }: PropsWithChildren) => {
  return (
    <ApolloWrapper>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <div className="flex-1">{children}</div>
        </div>
      </AuthProvider>
    </ApolloWrapper>
  );
};

export default MainLayout;
