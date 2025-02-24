import { PropsWithChildren, Suspense } from 'react';
import './global.css';
import { ApolloWrapper } from '@/components/providers';
import { ToastContainer } from 'react-toastify';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import 'react-toastify/dist/ReactToastify.css';

const RootLayout = ({ children }: PropsWithChildren) => {
  return (
    <ApolloWrapper>
      <html lang="en">
        <body>
          <Suspense>
            <NuqsAdapter>{children}</NuqsAdapter>
            <ToastContainer />
          </Suspense>
        </body>
      </html>
    </ApolloWrapper>
  );
};

export default RootLayout;
