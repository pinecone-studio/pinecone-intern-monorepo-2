'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { IoSearch } from 'react-icons/io5';
import { SlBasket } from 'react-icons/sl';
import { useAuth } from '@/components/providers/AuthProvider';

export const Header = () => {
  const { user, signout } = useAuth();

  return (
    <div className=" z-10 flex justify-between gap-4 px-4 py-4 text-white bg-black border-b border-gray-600 md:flex-row md:px-12 md:py-6 md:gap-0">
      <div className="flex items-center justify-center md:justify-start">
        <Link href="/user/home" className="flex gap-2">
          <Image src="/images/logo.png" alt="HeaderLogo" width={212} height={48} className="w-auto h-8 md:h-12" />
        </Link>
      </div>

      <div className="relative flex items-center w-full px-2 md:px-6 md:w-auto">
        <Input type="text" placeholder="Хайлт" className="relative w-full bg-black border-gray-600 md:w-80" />
        <IoSearch className="absolute w-4 h-4 right-4 md:right-16 color-white" />
      </div>

      <div className="flex items-center justify-center gap-2 md:justify-end md:gap-4">
        <Link href="/user/order">
          <SlBasket className="w-5 h-5 mx-2 md:mx-4" />
        </Link>
        {!user && (
          <div className="flex items-center gap-2 md:gap-4">
            <Link href="/user/sign-up">
              <Button data-cy="SignUpBtn" data-testid="SignUpBtn" className="text-xs font-medium leading-5 bg-black border border-gray-600 rounded-lg md:text-sm w-28 md:w-36">
                Бүртгүүлэх
              </Button>
            </Link>

            <Link href="/user/sign-in">
              <Button data-cy="SignInBtn" data-testid="SignInBtn" className="text-xs md:text-sm font-medium leading-5 text-black bg-[#00B7f4] w-28 md:w-36">
                Нэвтрэх
              </Button>
            </Link>
          </div>
        )}
        {user && (
          <div className="flex items-center gap-2 ">
            <span data-cy="UserEmail" data-testid="UserEmail" className="text-sm font-medium text-gray-300">
              {user.email}
            </span>
            <Button data-cy="SignOutBtn" data-testid="SignOutBtn" className="text-xs md:text-sm font-medium leading-5 text-black bg-[#00B7f4] w-20 md:w-28" onClick={signout}>
              Гарах
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
