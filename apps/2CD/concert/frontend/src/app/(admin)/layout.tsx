import { ApolloWrapper } from '@/components/providers';
import { ReactNode } from 'react';
import { Header } from './_components/Header';

const AdminLayout = ({ children }: { children: ReactNode }) => {
  return (
    <ApolloWrapper>
      <div className="bg-[#F4F4F5] h-100vh">
        <Header />
        {children}
      </div>
    </ApolloWrapper>
  );
};

export default AdminLayout;
