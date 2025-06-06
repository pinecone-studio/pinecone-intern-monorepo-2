import { useRouter } from 'next/navigation';
import { Home, Wallet, User, List, Info, X } from 'lucide-react';

interface SidebarProps {
  onClose: () => void;
}

const SidebarContent = ({ onClose }: SidebarProps) => {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
    onClose();
  };

  return (
    <div className="flex flex-col justify-between h-full">
      <div>
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Цэс</h2>
          <button onClick={onClose} className="text-xl">
            <X />
          </button>
        </div>
        <nav className="divide-y">
          <SidebarItem icon={<Home size={20} />} text="Нүүр хуудас" onClick={() => handleNavigation('/Home')} testId="nav-home" />
          <SidebarItem icon={<Wallet size={20} />} text="Хэтэвч" onClick={() => handleNavigation('/Home/wallet')} testId="nav-wallet" />
          <SidebarItem icon={<User size={20} />} text="Хэрэглэгч" onClick={() => handleNavigation('/Home/profile')} testId="nav-profile" />
          <SidebarItem icon={<List size={20} />} text="Захиалгын түүх" onClick={() => handleNavigation('/Home/orders')} testId="nav-orders" />
          <SidebarItem icon={<Info size={20} />} text="Бидний тухай" onClick={() => handleNavigation('/Home/about')} testId="nav-about" />
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

export default SidebarContent;
