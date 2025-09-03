import { PanelLeft } from 'lucide-react';

const Header = () => {
  return (
    <div className="p-4 border-t flex items-center space-x-2 text-[#020617] text-sm font-normal">
      <PanelLeft className="w-3 h-3 text-[#334155]" />
      <span>Hotels</span>
    </div>
  );
};

export default Header;
