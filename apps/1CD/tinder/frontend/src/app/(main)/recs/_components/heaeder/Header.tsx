'use client';
import { MessageSquare } from 'lucide-react';
import Image from 'next/image';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { useGetMatchedUserQuery } from '@/generated';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Logout } from './_feature/Header';



const Header = () => {
  const [open, setOpen] = useState(false);
  const { data } = useGetMatchedUserQuery({
    variables: {
      matchedUser: '6746baabd05c7f4092dad320',
    },
  });

  return (
    <div className="border-b-[1px] border-[#E4E4E7]  " data-cy="header">
      <div className="flex justify-between items-c mx-[10%] py-1 relative max-w-[1280px] ">
        <div data-cy="register-email-header" className="flex items-center">
          <Image src="/logo.svg" width={20} height={24} alt="logo" className="w-5 h-6" />
          <div className="text-[#424242] font-bold text-2xl">tinder</div>
        </div>
        <div className="flex items-center gap-2 py-2">
          <Link href={'/chat'}>
            <MessageSquare />
          </Link>

          <Avatar onClick={() => setOpen(!open)} className="cursor-pointer ">
            <AvatarImage src={data?.getMatchedUser.userImg} alt="@shadcn" className="object-cover" />
          </Avatar>

          {open && (
            <div className="absolute top-16 right-[2px] bg-white border-[1px] border-[#E4E4E7] rounded-lg shadow-lg z-[10000000]">
              <div className='flex flex-col gap-2 p-2'>
                <Link href={'/profile'}>
                <Button className='bg-red-300 cursor-pointer hover:bg-red-400 focus:bg-red-400 '>Profile</Button>
                </Link>
              
                <Button className='bg-red-300 cursor-pointer hover:bg-red-400 focus:bg-red-400' onClick={()=>Logout()}>Logout</Button>
               
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Header;
