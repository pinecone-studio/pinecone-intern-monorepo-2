import SideBar from '@/components/providers/Sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { ReactNode } from 'react';
import { Toaster } from 'sonner';

const AdminLayout = async ({ children }: { children: ReactNode }) => {
  // const cookieStore = await cookies();
  // const defaultOpen = cookiesStore.get('sidebar:state')?.value === 'true';

  // const AppSidebar = () => {
  //   const { state, open, setOpen, setOpenMobile, isMobile, toggleSidebar } = useSidebar();
  // };

  return (
    <div>
      <Toaster />
      <SidebarProvider className="flex">
        <SideBar />
        <div className="flex-1">{children}</div>
      </SidebarProvider>
    </div>
  );
};
export default AdminLayout;
