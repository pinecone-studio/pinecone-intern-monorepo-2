import { Circle, ShoppingCart } from 'lucide-react';
import { SearchBox } from './SearchBox';
import { Button } from '@/components/ui/button';
export const Header = () => {
  return (
    <div className="px-10 py-7 flex justify-between items-center">
      <div className="flex gap-2 items-center">
        <Circle color="#00B7F4" fill="#00B7F4" size={'20px'} />
        <p className="text-[24px]">TICKET BOOKING</p>
      </div>
      <div>
        <SearchBox />
      </div>
      <div className="flex gap-4 items-center">
        <ShoppingCart />
        <Button className=" w-[140px] bg-[#09090B] border border-[#27272A]">Бүртгүүлэх</Button>
        <Button className=" w-[140px] bg-[#00B7F4]">Нэвтрэх</Button>
      </div>
    </div>
  );
};
