import SideBar from '@/components/providers/Sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { ReactNode } from 'react';

const Layout = async ({ children }: { children: ReactNode }) => {
  // const cookieStore = await cookies();
  // const defaultOpen = cookiesStore.get('sidebar:state')?.value === 'true';

  // const AppSidebar = () => {
  //   const { state, open, setOpen, setOpenMobile, isMobile, toggleSidebar } = useSidebar();
  // };

  return (
    <div>
      <SidebarProvider>
        <SideBar />
        {children}
      </SidebarProvider>
    </div>
  );
};
export default Layout;
