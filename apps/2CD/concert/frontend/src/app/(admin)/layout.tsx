import { PropsWithChildren } from 'react';

import { ApolloWrapper } from '@/components/providers';
import { Header } from './_components/Header';

const RootLayout = ({ children }: PropsWithChildren) => {
  return (
    <ApolloWrapper>
      <div className="bg-[#F4F4F5] h-100vh">
        <Header />
        {children}
      </div>
    </ApolloWrapper>
  );
};

export default RootLayout;
