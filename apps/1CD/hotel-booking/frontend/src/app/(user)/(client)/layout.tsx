import { PropsWithChildren } from 'react';
import Footer from '@/components/Footer';
import HeaderCheckout from '@/app/(user)/(client)/_components/HeaderCheckout';
import { ToastContainer } from 'react-toastify';

const ClientLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex flex-col min-h-screen ">
      <HeaderCheckout />
      <div className="flex-1">
        {children}
        <ToastContainer />
      </div>
      <Footer />
    </div>
  );
};

export default ClientLayout;
