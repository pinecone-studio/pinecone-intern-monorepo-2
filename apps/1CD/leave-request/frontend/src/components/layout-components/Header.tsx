import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import WhoAmI from '@/utils/decode-token';
import { getEmail } from '@/utils/get-email';
import Image from 'next/image';
import Link from 'next/link';
import { ProfilePic } from '../layout-components/ProfilePic';

const adminHeader = [
  { label: 'Employee List', value: 'employeeList' },
  { label: 'Leave Calendar', value: 'leaveCalendar' },
  { label: 'Leave Requests', value: 'leaveRequests' },
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
  const role: string = getRole(decoded as { role: string });
  return (role == 'supervisee' && superviseeHeader) || (role == 'supervisor' && supervisorHeader) || adminHeader;
};

const getRole = (decoded: { role: string }) => {
  const { role } = decoded || '';
  return role;
};

const Header = async () => {
  const NavBar = await getCorrectNavBar();
  const email = await getEmail();
  return (
    <div className="flex flex-col gap-4 px-6 pt-4 ">
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-4">
          <Image src="/Logo/Vector.svg" width={32} height={28} alt="Logo" />
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Dashboard" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Leave">Leave Request</SelectItem>
              <SelectItem value="Pay">Payroll</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <ProfilePic email={email} />
      </div>
      <nav className=" md:flex gap-6 text-sm font-medium text-[#09090B]">
        {NavBar.map((item) => (
          <Link key={item.value} href={`/${item.value}`} className={`px-3 py-2 pb-3.5 `}>
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Header;
