import { Footer } from '@/components/privateHeaderAndFooter/Footer';
import { Header } from '@/components/privateHeaderAndFooter/Header';

import { UserAuthProvider } from '@/components/providers/UserAuthProvider';
const PrivateLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <UserAuthProvider>
      <div className="flex items-center flex-col min-h-screen w-screen ">
        <Header />
        {children}
        <Footer />
      </div>
    </UserAuthProvider>
  );
};

export default PrivateLayout;
