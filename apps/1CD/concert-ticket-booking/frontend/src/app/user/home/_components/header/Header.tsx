'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { useAuth } from '@/components/providers/AuthProvider';
import { useQueryState } from 'nuqs';
import { Filter, House, LogOut, Search, ShoppingCart } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

export const Header = () => {
  const [q, setQ] = useQueryState('q', { defaultValue: '' });
  const { user, signout } = useAuth();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isDetailOrProfilePage = pathname?.includes('/user/home/event/') || pathname?.includes('/user/home/user-profile');
  const handleItemClick = () => {
    setOpen(false);
  };
  return (
    <div className="z-10 flex justify-between px-4 py-4 text-white bg-black border-b border-gray-600 md:flex-row md:px-12 md:py-6 ">
      <div className="flex items-center justify-center flex-none md:justify-start">
        <Link href="/user/home" className="flex gap-2">
          <Image src="/images/logo.png" alt="HeaderLogo" width={212} height={48} className="w-auto sm:h-8 md:h-12" />
        </Link>
      </div>

      {!isDetailOrProfilePage && (
        <div className="relative flex items-center px-2 text-xs w-36 md:px-6 md:w-80 lg:w-96 ">
          <Input data-testid="Search-Input" type="text" placeholder="Хайлт" className="w-full text-xs bg-black border-gray-600 " value={q} onChange={(e) => setQ(e.target.value)} />
          <Search className="absolute w-4 h-4 right-4 md:right-16 color-white" />
        </div>
      )}

      <div className="flex items-center justify-center gap-1 md:justify-end md:gap-4">
        <Link href="/user/home/filter">
          <Filter className="hidden w-4 h-4 mx-1 xl:w-5 xl:h-5 lg:block" />
        </Link>
        {!user && (
          <div>
            <div className="flex items-center gap-2 md:gap-4">
              <div className="flex items-center gap-2 lg:hidden">
                <DropdownMenu open={open} onOpenChange={setOpen}>
                  <DropdownMenuTrigger data-testid="dropdown-trigger">
                    <House className="w-5 h-5 text-gray-200 hover:text-white" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="text-white bg-gray-800 shadow-lg">
                    <DropdownMenuItem>
                      <Link href="/user/home/filter" className="hover:text-gray-300">
                        <button data-testid="EventsCl" onClick={handleItemClick}>
                          Эвентүүд
                        </button>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/user/sign-in" className="hover:text-gray-300">
                        <button data-testid="SignInCl" onClick={handleItemClick}>
                          Нэвтрэх
                        </button>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/user/sign-up" className="hover:text-gray-300">
                        <button data-testid="SignUpCl" onClick={handleItemClick}>
                          Бүртгүүлэх
                        </button>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <Link href="/user/sign-up">
                <Button
                  data-cy="SignUpBtn"
                  data-testid="SignUpBtn"
                  className="lg:block hidden text-[10px] md:text-xs  font-medium leading-5 bg-black border border-gray-600 rounded-lg xl:text-sm w-20 md:w-28 xl:w-36"
                >
                  Бүртгүүлэх
                </Button>
              </Link>
              <Link href="/user/sign-in">
                <Button
                  data-cy="SignInBtn"
                  data-testid="SignInBtn"
                  className="lg:block hidden text-[10px] md:text-xs xl:text-sm font-medium leading-5 text-black bg-[#00B7f4] w-20 md:w-28 xl:w-36 hover:text-white"
                >
                  Нэвтрэх
                </Button>
              </Link>
            </div>
          </div>
        )}
        {user && (
          <div className="flex items-center gap-2 ">
            <Link href="/user/home/user-profile">
              <ShoppingCart className="hidden w-4 h-4 mx-1 xl:w-5 xl:h-5 md:mx-4 lg:block" />
            </Link>
            <span data-cy="UserEmail" data-testid="UserEmail" className="hidden text-sm font-medium text-gray-300 lg:block">
              {user.email}
            </span>
            <div className="flex items-center gap-2 lg:hidden">
              <DropdownMenu open={open} onOpenChange={setOpen}>
                <DropdownMenuTrigger data-testid="dropdown-trigger">
                  <House className="w-5 h-5 text-gray-200 hover:text-white" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="text-white bg-gray-800 shadow-lg">
                  <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href="/user/home/user-profile" className="hover:text-gray-300">
                      <button data-testid="user-close-button" onClick={handleItemClick}>
                        Хэрэглэгчийн мэдээлэл
                      </button>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/user/home/filter" className="hover:text-gray-300">
                      <button data-testid="ClEvents" onClick={handleItemClick}>
                        Эвентүүд
                      </button>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Button data-testid="SignOutCl" onClick={signout} variant="ghost" className="text-red-500">
                      <LogOut className="w-4 h-4" />
                      <span>Гарах</span>
                    </Button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Button data-cy="SignOutBtn" data-testid="SignOutBtn" className="hidden font-medium leading-5 text-white bg-black md:text-sm lg:block" onClick={signout}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
