'use client'
import { Ticket } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
export const Header = () => {
    const pathName=usePathname()
  return (
    <div className="pt-5 px-10 bg-blue-300">
      <div className='flex justify-between'>
        <div className="flex gap-2 items-center">
          <Ticket size="50px" color="#00B7F4" />
          <p className="text-2xl font-[500]">TICKET BOOKING</p>
        </div>
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
      <div className='flex gap-2'>
      <Link href="/ticket">
          <p
            className={`cursor-pointer p-3 border-b-2 ${
              pathName.includes('ticket') ? 'border-black ' : 'border-transparent '
            }`}
          >
            Тасалбар
          </p>
        </Link>

        <Link href="/requests">
          <p
            className={`cursor-pointer p-3 border-b-2 ${
                pathName.includes('request') ? 'border-black ' : 'border-transparent '
            }`}
          >
            Цуцлах хүсэлт
          </p>
        </Link>
      </div>
    </div>
  );
};
