'use client';

import '../global.css';
import { ApolloWrapper } from '@/components/providers/ApolloWrapper';
import { UserAuthProvider } from '@/components/providers/UserAuthProvider';

const PrivateLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body>
        <ApolloWrapper>
          <UserAuthProvider>
            <div>{children}</div>
          </UserAuthProvider>
        </ApolloWrapper>
      </body>
    </html>
  );
};

export default PrivateLayout;
