'use client';

import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton } from '@/components/ui/sidebar';
import { Hotel, UserPen, Users } from 'lucide-react';
import Link from 'next/link';

const SideBar = () => {
  const item = [
    { title: 'Hotels', icon: <Hotel /> },
    { title: 'Guests', icon: <Users /> },
  ];
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex gap-2 pl-2 pt-2.5 items-center">
          <div className="w-[32px] h-[32px] bg-[#2563EB] rounded-lg flex justify-center items-center">
            <div className="w-[16px] h-[16px] bg-white rounded-full"></div>
          </div>
          <div>
            <div className="text-[14px]">Pedia</div>
            <div className="text-[12px] text-[#334155]">Admin</div>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="pt-6 w-full">
        {item.map((item) => (
          <SidebarMenu key={item.title}>
            <SidebarMenuButton asChild>
              <Link href="/">
                <span className="pl-2.5">{item.icon}</span>
                <span className="pl-2.5">{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenu>
        ))}
      </SidebarContent>
      <SidebarFooter className="pb-6">
        <div className="flex gap-2 pl-2 pt-2.5 items-center">
          <UserPen className="w-[32px] h-[32px]" />
          <div>
            <div className="text-[14px]">Admin</div>
            <div className="text-[12px] text-[#334155]">Admin@pedia.com</div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
export default SideBar;
