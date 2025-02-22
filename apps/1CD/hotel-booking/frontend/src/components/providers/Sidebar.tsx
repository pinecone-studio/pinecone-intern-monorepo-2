'use client';

import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton } from '@/components/ui/sidebar';
import { Hotel, UserPen, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const SideBar = () => {
  const pathname = usePathname();
  const item = [
    { title: 'Hotels', icon: <Hotel />, link: '/add-hotel/home-page' },
    { title: 'Guests', icon: <Users />, link: '/guests' },
  ];
  return (
    <Sidebar className="bg-white">
      <SidebarHeader>
        <div className="flex gap-2 pl-2 pt-2.5 items-center">
          <div className="w-[40px] h-[40px] bg-[#2563EB] rounded-lg flex justify-center items-center">
            <div className="w-[16px] h-[16px] bg-white rounded-full"></div>
          </div>
          <div>
            <div className="text-[18px] text-[#2563EB] font-bold">Pedia</div>
           
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="w-full pt-6">
        {item.map((item) => (
          <SidebarMenu key={item.title}>
            <SidebarMenuButton asChild className='p-4 hover:border-r-[2px] hover:border-[#2564eb/20]'>
              <Link className={`p-4 w-[200px] flex gap-1 text-[#2563EB] hover:bg-blue-50 transition-all duration-200 hover:scale-95 ${pathname === item.link ? 'bg-blue-50 border-r-2 border-blue-200' : ''}`} href={item.link}>
                <span >{item.icon}</span>
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenu>
        ))}
      </SidebarContent>
      <SidebarFooter className="pb-6">
        <div className="flex gap-2 pl-2 pt-2.5 items-center">
          <UserPen className="w-[32px] h-[32px]" color='#2563EB' />
          <div>
            <div className="text-[14px] text-[#2563EB]">Admin</div>
            <div className="text-[12px]  text-[#2563EB]">Admin@pedia.com</div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
export default SideBar;
