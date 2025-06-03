'use client';
import { Ticket } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { usePathname, useRouter } from 'next/navigation';
export const Header = () => {
  const pathName = usePathname();
  const router = useRouter();
  return (
    <div className="pt-5 px-10 bg-white">
      <div className="flex justify-between">
        <div className="flex gap-2 items-center">
          <Ticket size="50px" color="#00B7F4" />
          <p className="text-2xl font-[500]">TICKET BOOKING</p>
        </div>
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
      <div className="flex gap-2">
        <p onClick={() => router.push(`/ticket`)} data-testid="adminPageName" className={`cursor-pointer p-3 border-b-2 ${pathName.includes('ticket') ? 'border-black ' : 'border-transparent '}`}>
          Тасалбар
        </p>
        <p onClick={() => router.push(`/request`)} data-testid="adminPageName" className={`cursor-pointer p-3 border-b-2 ${pathName.includes('request') ? 'border-black ' : 'border-transparent '}`}>
          Цуцлах хүсэлт
        </p>
      </div>
    </div>
  );
};
