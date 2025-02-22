import { PropsWithChildren } from 'react';

import HeaderCheckout from '@/app/(user)/(client)/_components/HeaderCheckout';
import { Toaster } from '@/components/ui/sonner';
import Footer from '@/components/Footer';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ClientLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Toaster />
      <HeaderCheckout />
      <ToastContainer />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
};

export default ClientLayout;
