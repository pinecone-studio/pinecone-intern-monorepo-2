'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { useAuth } from '@/components/providers/AuthProvider';
import { useQueryState } from 'nuqs';
import { Filter, Search, ShoppingCart } from 'lucide-react';

export const Header = () => {
  const [q, setQ] = useQueryState('q', { defaultValue: '' });
  const { user, signout } = useAuth();

  return (
    <div className="z-10 flex justify-between px-4 py-4 text-white bg-black border-b border-gray-600 md:flex-row md:px-12 md:py-6 ">
      <div className="flex items-center justify-center flex-none md:justify-start">
        <Link href="/user/home" className="flex gap-2">
          <Image src="/images/logo.png" alt="HeaderLogo" width={212} height={48} className="w-auto sm:h-8 md:h-12" />
        </Link>
      </div>

      <div className="relative flex items-center px-2 text-xs md:px-6 md:w-80 lg:w-96 w-[360px] ">
        <Input data-testid="Search-Input" type="text" placeholder="Хайлт" className="w-full text-xs bg-black border-gray-600 " value={q} onChange={(e) => setQ(e.target.value)} />
        <Search className="absolute w-4 h-4 right-4 md:right-16 color-white" />
      </div>

      <div className="flex items-center justify-center gap-1 md:justify-end md:gap-4">
        <Link href="/user/home/filter">
          <Filter className="hidden w-4 h-4 mx-1 xl:w-5 xl:h-5 sm:block" />
        </Link>
        {!user && (
          <div className="flex items-center gap-2 md:gap-4">
            <Link href="/user/sign-up">
              <Button
                data-cy="SignUpBtn"
                data-testid="SignUpBtn"
                className="sm:block hidden text-[10px] md:text-xs  font-medium leading-5 bg-black border border-gray-600 rounded-lg xl:text-sm w-20 md:w-28 xl:w-36"
              >
                Бүртгүүлэх
              </Button>
            </Link>

            <Link href="/user/sign-in">
              <Button data-cy="SignInBtn" data-testid="SignInBtn" className="text-[10px] md:text-xs xl:text-sm font-medium leading-5 text-black bg-[#00B7f4] w-20 md:w-28 xl:w-36 hover:text-white">
                Нэвтрэх
              </Button>
            </Link>
          </div>
        )}
        {user && (
          <div className="flex items-center gap-2 ">
            <Link href="/user/home/user-profile">
              <ShoppingCart className="xl:w-5 xl:h-5 w-4 h-4 mx-1 md:mx-4 sm:block hidden" />
            </Link>
            <span data-cy="UserEmail" data-testid="UserEmail" className="text-sm font-medium text-gray-300">
              {user.email}
            </span>
            <Button data-cy="SignOutBtn" data-testid="SignOutBtn" className="text-xs md:text-sm font-medium leading-5 text-black bg-[#00B7f4] w-20 md:w-28 hover:text-white" onClick={signout}>
              Гарах
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
