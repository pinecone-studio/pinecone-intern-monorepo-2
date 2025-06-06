import { SearchIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
export const SearchBox = () => {
  return (
    <div className="flex border-2 border-[#27272A] p-1 px-5 items-center rounded-md w-[360px]">
      <Input className="bg-black border-none" placeholder="Хайлт" />
      <SearchIcon />
    </div>
  );
};
