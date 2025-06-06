import { PropsWithChildren } from 'react';
import './global.css';
import { ApolloWrapper } from '@/components/providers';
import { ClerkProvider } from '@clerk/nextjs';
export const metadata = {
  title: 'Welcome to example-frontend',
  description: 'Generated by create-nx-workspace',
};

const RootLayout = ({ children }: PropsWithChildren) => {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <ApolloWrapper> {children}</ApolloWrapper>
        </body>
      </html>
    </ClerkProvider>
  );
};

export default RootLayout;
