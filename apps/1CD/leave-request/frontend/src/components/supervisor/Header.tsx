import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Image from 'next/image';

const Header = () => {
  return (
    <header className="flex flex-col h-16 gap-4 px-6 pt-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-4">
          <Image src="/Logo/Vector.svg" width={32} height={28} alt="Logo" />
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Payroll" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Leave">Leave Request</SelectItem>
              <SelectItem value="Pay">Payroll</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center">
          <button className="w-8 h-8 overflow-hidden bg-gray-300 rounded-full"></button>
        </div>
      </div>
      <nav className="hidden md:flex gap-6 text-sm font-medium text-[#09090B] ">
        {['Pending Requests', 'Leave Calendar', 'My Requests', 'Request Forms'].map((item, index) => (
          <a key={index} href={item.replace(' ', '')} className="px-3 py-2 border-b-gray-500 hover:border-b-black hover:text-blue-600">
            {item}
          </a>
        ))}
      </nav>
    </header>
  );
};

export default Header;
