'use client';
import { MessageSquare } from 'lucide-react';
import Image from 'next/image';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useGetMeQuery } from '@/generated';
import { useRouter } from 'next/navigation';

const Header = () => {
  const [open, setOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const router = useRouter();
  
  const { data } = useGetMeQuery();
  console.log(data);

  const Logout = async () => {
    await fetch('/deleteToken');
    window.location.href = "/signIn";
  };
  const handleReload = () => {
    router.push('/recs'); 
  };

  return (
    <div className="border-b-[1px] border-[#E4E4E7]" data-cy="header">
      <div className="flex justify-between items-center mx-[10%] py-1 relative max-w-[1280px]">
        <div data-cy="register-email-header" className="flex items-center" onClick={handleReload}>
          <Image src="/logo.svg" width={20} height={24} alt="logo" className="w-5 h-6" />
          <div className="text-[#ff5864] font-bold text-2xl">Tinder</div>
        </div>
        <div className="flex items-center gap-2 py-2">
          <Link href={'/chat'}>
            <MessageSquare />
          </Link>

          <Avatar  data-cy='avatar' onClick={() => setOpen(!open)} className="cursor-pointer">
            <AvatarImage src={data?.getMe.photos[0]} alt="@shadcn" className="object-cover" />
          </Avatar>

          {open && (
            <div className="absolute top-16 right-[2px] bg-white border border-[#E4E4E7] rounded-lg shadow-lg z-[10000000]">
              <div className='flex flex-col gap-2 p-2'>
                <Link href={'/profile'}>
                  <Button className='text-white bg-red-500 cursor-pointer hover:bg-red-600 focus:bg-red-600'>Profile</Button>
                </Link>
                <Button className='text-white bg-red-500 cursor-pointer hover:bg-red-600 focus:bg-red-600' onClick={() => setShowLogoutModal(true)}>Logout</Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-[10000000]">
          <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-lg font-bold text-gray-800">Are you sure?</h2>
            <p className="text-gray-600">You will be logged out of your account.</p>
            <div className="flex justify-end gap-3 mt-4">
              <Button data-cy='Cancel' className="text-gray-700 bg-gray-300 hover:bg-gray-400" onClick={() => setShowLogoutModal(false)}>Cancel</Button>
              <Button data-cy='Logout' className="text-white bg-red-500 hover:bg-red-600" onClick={Logout}>Logout</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
