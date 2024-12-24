import { PropsWithChildren } from 'react';
import { AuthProvider } from '../../components/providers';

const ClientLayout = ({ children }: PropsWithChildren) => {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen">
        <div className="flex-1">{children}</div>
      </div>
    </AuthProvider>
  );
};

export default ClientLayout;
