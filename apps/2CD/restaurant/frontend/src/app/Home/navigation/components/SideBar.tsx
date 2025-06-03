'use client';

import { useRouter } from 'next/navigation';
import { Home, Wallet, User, List, Info, Menu } from 'lucide-react';

interface SidebarProps {
  onClose: () => void;
}

const Sidebar = ({ onClose }: SidebarProps) => {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
    onClose();
  };

  return (
    <div className="fixed top-0 left-0 w-72 h-full bg-white z-50 shadow-lg flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-center p-4 border-b">
          <Menu />
          <button onClick={onClose} className="text-2xl">
            ×
          </button>
        </div>
        <nav className="divide-y">
          <SidebarItem icon={<Home size={20} />} text="Нүүр хуудас" onClick={() => handleNavigation('/')} testId="nav-home" />
          <SidebarItem icon={<Wallet size={20} />} text="Хэтэвч" onClick={() => handleNavigation('/wallet')} testId="nav-wallet" />
          <SidebarItem icon={<User size={20} />} text="Хэрэглэгч" onClick={() => handleNavigation('/profile')} testId="nav-profile" />
          <SidebarItem icon={<List size={20} />} text="Захиалгын түүх" onClick={() => handleNavigation('/orders')} testId="nav-orders" />
          <SidebarItem icon={<Info size={20} />} text="Бидний тухай" onClick={() => handleNavigation('/about')} testId="nav-about" />
        </nav>
      </div>
      <div className="p-4">
        <button className="w-full bg-[#2ECC71] text-white py-2 rounded-lg">Гарах</button>
      </div>
    </div>
  );
};

const SidebarItem = ({ icon, text, onClick, testId }: { icon: React.ReactNode; text: string; onClick?: () => void; testId?: string }) => (
  <button onClick={onClick} data-testid={testId} className="flex items-center gap-3 p-4 hover:bg-gray-100 w-full text-left">
    {icon}
    <span>{text}</span>
  </button>
);

export default Sidebar;
