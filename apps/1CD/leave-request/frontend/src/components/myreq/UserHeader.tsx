import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Image from 'next/image';
import { Sun } from 'lucide-react';

const UserHeader = () => {
  return (
    <header className="flex flex-col h-16 gap-4 px-6 pt-4 mb-24 bg-white">
      <div className="flex items-center justify-between gap-4 bg-white">
        <div className="flex gap-4 ">
          <Image src="/Logo/Vector.svg" width={32} height={28} alt="Logo" />
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Request" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MyRequest">My Request</SelectItem>
              <SelectItem value="RequestForm">Request Form</SelectItem>
              <SelectItem value="LeaveCalendar">Leave Calendar</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-6  bg-white">
        <Sun />
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </div>
      <nav className="hidden md:flex gap-6 text-sm font-medium text-[#09090B]">
        {['MyRequest', 'RequestForm', 'LeaveCalendar'].map((item, index) => (
          <a key={index} href={item.replace(' ', '')} className="px-3 py-2 border-b-gray-500 hover:border-b-black hover:text-blue-600">
            {item}
          </a>
        ))}
      </nav>
    </header>
  );
};

export default UserHeader;
