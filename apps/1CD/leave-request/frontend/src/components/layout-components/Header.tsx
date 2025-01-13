import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import WhoAmI from '@/utils/decode-token';
import { getEmail } from '@/utils/get-email';
import Image from 'next/image';
import { ProfilePic } from '../layout-components/ProfilePic';
import { NavbarEle } from './NavBar';

const adminHeader = [

  { label: 'Employee List', value: 'admin' },
  { label: 'Leave Calendar', value: 'leaveCalendar' },
  { label: 'Leave requests', value: 'supervisor' },

];
const supervisorHeader = [
  { label: 'Pending Requests', value: 'supervisor' },
  { label: 'Leave Calendar', value: 'leaveCalendar' },
  { label: 'My requests', value: 'MyRequest' },
  { label: 'Request Form', value: 'createNewRequest' },
];
const superviseeHeader = [
  { label: 'My requests', value: 'MyRequest' },
  { label: 'Request Form', value: 'createNewRequest' },
  { label: 'Leave Calendar', value: 'leaveCalendar' },
];

const getCorrectNavBar = async () => {
  const decoded = await WhoAmI();
  const role: string = getRole(decoded as { role: string });
  console.log('Role', role)
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
    <div className="flex flex-col gap-4 px-6 pt-4 bg-white">
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
      <NavbarEle NavBar={NavBar}/>
    </div>
  );
};

export default Header;
