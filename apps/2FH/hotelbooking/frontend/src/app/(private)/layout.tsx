import { UserAuthProvider } from '@/components/providers/UserAuthProvider';
const PrivateLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <UserAuthProvider>
      <div className="flex items-center flex-col min-h-screen w-screen ">{children}</div>
    </UserAuthProvider>
  );
};

export default PrivateLayout;
