/* eslint-disable unicorn/filename-case */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable complexity */
'use client';
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { useUser } from '@clerk/nextjs';
import UserSearchPage from '../userSearch/Page';
const HomeHeader = () => {
  const { user } = useUser();
  const userName = user?.username || 'guest'
  return (
    <>
      <div className='w-full h-[200px] relative'>
          <SignedOut >
            <div className='w-full bg-[#013B94] flex p-4 justify-center'>
              <div className='flex w-[1280px] justify-between'>
                <div className='flex gap-2'>
                  <div className='h-[20px] w-[20px] bg-white rounded-full'></div>
                  <p className='text-white'>Pedia</p>
                </div>
                <div className="rounded-lg text-white text-[14px] gap-8 flex">
                  <div>
                    <SignUpButton />
                  </div>
                  <div>1
                    <SignInButton />
                  </div>
                </div>
              </div>
            </div>
            <div className='bg-[#013B94] w-full h-[100px]'>
            </div>
          </SignedOut>
          <SignedIn>
            <div className='flex w-full p-4 justify-center'>
              <div className='w-[1280px] flex justify-between'>
                <div className='flex gap-3 justify-center items-center'>
                  <div className='h-[20px] w-[20px] bg-[#013B94] rounded-full'></div>
                  <p className='text-[16px]'>Pedia</p>
                </div>
                <div className='flex gap-6 justify-center items-center'>
                  <p>My Booking</p>
                  {userName}
                  <UserButton />
                </div>
              </div>
            </div>
          </SignedIn> 
        <div className='absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[1160px] h-[94px]'>
          <UserSearchPage />
      </div>
      </div>
    </>
  );
};

export default HomeHeader;


