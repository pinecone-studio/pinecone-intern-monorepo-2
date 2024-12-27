import { PropsWithChildren } from 'react';
import { AuthProvider, SignupProvider } from '../../components/providers';
import Footer from '@/components/Footer';
import HeaderCheckout from '@/components/HeaderCheckout';

const ClientLayout = ({ children }: PropsWithChildren) => {
  return (
    <AuthProvider>
      <SignupProvider>
        <div className="flex flex-col min-h-screen">
          <HeaderCheckout />
          <div className="flex-1">{children}</div>
          <Footer />
        </div>
      </SignupProvider>
    </AuthProvider>
  );
};

export default ClientLayout;
