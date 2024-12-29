import { PropsWithChildren } from 'react';
import HeaderCheckout from './_components/HeaderCheckout';
import Footer from '@/components/Footer';

const ClientLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex flex-col w-screen min-h-screen">
      <HeaderCheckout />
      <div>{children}</div>
      <Footer />
    </div>
  );
};

export default ClientLayout;
