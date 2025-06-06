import { ApolloWrapper } from '@/components/providers';
import { ReactNode } from 'react';
import { Header } from './_components/Header';

const AdminLayout = ({ children }: { children: ReactNode }) => {
  return (
    <ApolloWrapper>
      <div className="bg-[#09090B] min-h-screen text-white">
        <Header />
        {children}
      </div>
    </ApolloWrapper>
  );
};

export default AdminLayout;
