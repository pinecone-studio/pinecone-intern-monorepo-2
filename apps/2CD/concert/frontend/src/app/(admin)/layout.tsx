import { ApolloWrapper } from '@/components/providers';
import { ReactNode } from 'react';

const AdminLayout = ({ children }: { children: ReactNode }) => {
  return <ApolloWrapper>{children}</ApolloWrapper>;
};
export default AdminLayout;