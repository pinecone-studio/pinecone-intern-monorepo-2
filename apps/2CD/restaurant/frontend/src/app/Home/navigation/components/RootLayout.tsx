'use client';

import { useState } from 'react';
import { PropsWithChildren } from 'react';
import Image from 'next/image';
import { ShoppingCart, Bell, Menu } from 'lucide-react';
import Sidebar from './SideBar';

const RootLayout = ({ children }: PropsWithChildren) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div>
      <header className="flex justify-between items-center p-4 border-b">
        <div>
          <Image src="/img/image.png" alt="Logo" width={30} height={30} />
        </div>
        <div className="flex items-center gap-6">
          <ShoppingCart />
          <Bell />
          <button onClick={() => setSidebarOpen(true)}>
            <Menu />
          </button>
        </div>
      </header>

      {isSidebarOpen && <Sidebar onClose={() => setSidebarOpen(false)} />}

      <main>{children}</main>
    </div>
  );
};

export default RootLayout;
