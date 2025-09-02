'use client';
import '../../global.css';
import DashboardSidebar from '@/components/admin/DashboardSidebar';
import { UserAuthProvider } from '@/components/providers/UserAuthProvider';
import { ApolloWrapper } from '@/components/providers/ApolloWrapper';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ApolloWrapper>
      <UserAuthProvider>
        <div className="flex h-screen bg-gray-100">
          <DashboardSidebar />
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </UserAuthProvider>
    </ApolloWrapper>
  );
};

export default AdminLayout;
