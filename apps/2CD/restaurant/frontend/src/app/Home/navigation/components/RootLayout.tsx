'use client';

import { useState } from 'react';
import { PropsWithChildren } from 'react';
import Image from 'next/image';
import { ShoppingCart, Bell, Menu } from 'lucide-react';
import Sidebar from './SideBar';
import { useRouter } from 'next/navigation';

const RootLayout = ({ children }: PropsWithChildren) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  return (
    <div>
      <header className="flex justify-between items-center p-4 border-b">
        <div>
          <Image src="/img/image.png" alt="Logo" width={30} height={30} />
        </div>
        <div className="flex items-center gap-6">
          <button data-testid="open-order" onClick={() => router.push('/order-detail')}>
            <ShoppingCart />
          </button>
          <button data-testid="open-notification" onClick={() => router.push('/notification')}>
            <Bell />
          </button>
          <button data-testid="open-sidebar" onClick={() => setSidebarOpen(true)}>
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
