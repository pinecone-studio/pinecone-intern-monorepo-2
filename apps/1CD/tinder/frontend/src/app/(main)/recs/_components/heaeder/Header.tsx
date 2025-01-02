import { MessageSquare } from 'lucide-react';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';

const Header = () => {
  return (
    <div className="border-b-[1px] border-[#E4E4E7]" data-cy='header'>
      <div className="flex justify-between items-center mx-[10%] py-1">
        <div data-cy="register-email-header" className="flex items-center">
          <Image src="/logo.svg" width={20} height={24} alt="logo" className="w-5 h-6" />
          <div className="text-[#424242] font-bold text-2xl">tinder</div>
        </div>
        <div className="flex items-center gap-1 py-1">
          <Link href={'/chat'}>
             <MessageSquare />
          </Link>

          <Avatar>
            <AvatarImage src="/" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
};
export default Header;
