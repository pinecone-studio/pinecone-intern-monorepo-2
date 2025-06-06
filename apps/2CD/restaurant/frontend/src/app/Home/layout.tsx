'use client';

import { PropsWithChildren } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Bell } from 'lucide-react';
import Sidebar from './components/Sidebar'; 
import { useRouter } from 'next/navigation';

const RootLayout = ({ children }: PropsWithChildren) => {
  const router = useRouter();

  return (
    <div>
      <header className="flex justify-between items-center p-4 border-b">
        <div>
          <Link href="/Home">
            <Image src="/img/image.png" alt="Logo" width={30} height={30} />
          </Link>
        </div>
        <div className="flex items-center gap-6">
          <button onClick={() => router.push('/Home/order-detail')} data-testid="open-order">
            <ShoppingCart />
          </button>
          <button onClick={() => router.push('/Home/notification')} data-testid="open-notification">
            <Bell />
          </button>
          <Sidebar />
        </div>
      </header>

      <main>{children}</main>
    </div>
  );
};

export default RootLayout;
