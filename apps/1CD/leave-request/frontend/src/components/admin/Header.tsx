
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import WhoAmI from '@/utils/decode-token';
import Image from 'next/image';
import Link from 'next/link';

const adminHeader = [
  { label: 'Employee List', value: 'emloyeeList' },
  { label: 'Leave Calendar', value: 'leaveCalendar' },
  { label: 'Leave requests', value: 'leaveRequests' },
];
const supervisorHeader = [
  { label: 'Pending Requests', value: 'pendingRequests' },
  { label: 'Leave Calendar', value: 'leaveCalendar' },
  { label: 'My requests', value: 'myRequests' },
  { label: 'Request Form', value: 'requestForm' },
];
const superviseeHeader = [
  { label: 'My requests', value: 'myRequests' },
  { label: 'Request Form', value: 'requestForm' },
  { label: 'Leave Calendar', value: 'leaveCalendar' },
];

const getCorrectNavBar = async () => {
  const decoded = await WhoAmI();
  const { role } = decoded as { role: string };
  return (role == 'supervisee' && superviseeHeader) || (role == 'supervisor' && supervisorHeader) || adminHeader;
};

const Header = async () => {



  const NavBar = await getCorrectNavBar();
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
      <nav className="hidden md:flex gap-6 text-sm font-medium text-[#09090B]">
        {NavBar.map((item) => (
          <Link key={item.value} href={`/${item.value}`} className={`px-3 py-2 pb-3.5 `}>
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
};

export default Header;
