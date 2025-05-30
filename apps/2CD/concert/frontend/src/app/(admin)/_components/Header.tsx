'use client';
import { Ticket } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChangePage } from './ChangePage';
export const Header = () => {
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
        <ChangePage pageName="ticket" />
        <ChangePage pageName="request" />
      </div>
    </div>
  );
};
