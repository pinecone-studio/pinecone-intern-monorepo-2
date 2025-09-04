'use client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useOtpContext } from '../providers';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import Link from 'next/link';

export const PublicHeader = () => {
  const router = useRouter();
  const { me, loading, signOut } = useOtpContext();

  const handleRegister = () => router.push('/signup');
  const handleSignIn = () => router.push('/login');
  const handleLogoClick = () => router.push('/');

  // 👇 Show loader while fetching user
  if (loading) {
    return (
      <div className="flex justify-between w-full pt-5 pb-5 px-40 items-center bg-[#013B94]">
        <Button className="flex gap-[5px] bg-transparent items-center" onClick={handleLogoClick}>
          <div className="p-3 bg-white rounded-full"></div>
          <div className="text-white">Pedia</div>
        </Button>
        <div className="flex gap-10 items-center">
          <div className="h-8 w-24 bg-gray-400 rounded animate-pulse"></div>
          <div className="h-8 w-24 bg-gray-400 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div data-testid="Header-Container">
      {me ? (
        <div className="flex justify-between w-full pt-5 pb-5 px-40 items-center bg-white">
          <Button className="flex gap-[5px] bg-transparent items-center" onClick={handleLogoClick}>
            <div className="p-3 bg-[#013B94] rounded-full"></div>
            <div className="text-black">Pedia</div>
          </Button>
          <div className="flex gap-10 items-center">
            <Link className="text-black" href={`/booking/${me._id}/history`}>
              My booking
            </Link>
            <Popover>
              <PopoverTrigger className="text-black">{me.firstName ? me.firstName : me.email}</PopoverTrigger>
              <PopoverContent className="w-fit flex flex-col">
                <Button variant={'outline'} className="py-0">
                  <Link href={'/user-profile'}>Profile</Link>
                </Button>
                <Button onClick={signOut} variant={'outline'} className="py-0">
                  Log out
                </Button>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      ) : (
        <div className="flex justify-between w-full pt-5 pb-5 px-40 items-center bg-[#013B94]">
          <Button className="flex gap-[5px] bg-transparent items-center" onClick={handleLogoClick}>
            <div className="p-3 bg-white rounded-full"></div>
            <div className="text-white">Pedia</div>
          </Button>
          <div className="flex gap-10 items-center">
            <Button className="text-white bg-[#013B94]" onClick={handleRegister}>
              Register
            </Button>
            <Button className="text-white bg-[#013B94]" onClick={handleSignIn}>
              Sign in
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
