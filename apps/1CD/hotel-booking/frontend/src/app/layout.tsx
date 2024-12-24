import { PropsWithChildren } from 'react';
import './global.css';
import { ApolloWrapper } from '@/components/providers';
import { ToastContainer } from 'react-toastify';

const RootLayout = ({ children }: PropsWithChildren) => {
  return (
    <ApolloWrapper>
      <html lang="en">
        <body>
          {children}
          <ToastContainer />
        </body>
      </html>
    </ApolloWrapper>
  );
};

export default RootLayout;
