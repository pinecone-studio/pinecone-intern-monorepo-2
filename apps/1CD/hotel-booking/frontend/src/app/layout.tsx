import { PropsWithChildren } from 'react';
import './global.css';
import { ApolloWrapper } from '@/components/providers';
import { ToastContainer } from 'react-toastify';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

const RootLayout = ({ children }: PropsWithChildren) => {
  return (
    <ApolloWrapper>
      <html lang="en">
        <body>
          <NuqsAdapter>{children}</NuqsAdapter>
          <ToastContainer />
        </body>
      </html>
    </ApolloWrapper>
  );
};

export default RootLayout;
