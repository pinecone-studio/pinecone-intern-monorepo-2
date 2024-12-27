import { PropsWithChildren } from 'react';
import '../.././global.css';
import FooterHome from '@/components/FooterHome';
import Header from '@/components/providers/Header';
import { AuthProvider, SignupProvider } from '@/components/providers';

const PublicLayout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <AuthProvider>
        <SignupProvider>
          <Header />
          {children}
          <FooterHome />
        </SignupProvider>
      </AuthProvider>
    </>
  );
};

export default PublicLayout;
