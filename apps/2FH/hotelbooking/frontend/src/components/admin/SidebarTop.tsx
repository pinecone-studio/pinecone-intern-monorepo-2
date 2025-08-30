import { Circle } from 'lucide-react';
import { Zap } from 'lucide-react';

const SidebarTop = () => {
  return (
    <div>
      <div className="p-4 text-xl font-bold flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-700 flex items-center justify-center rounded-lg">
          <Circle className="w-3 h-3 text-white bg-white  " />
        </div>
        <div>
          <p className="text-[#334155] font-medium text-sm">Pedia</p>
          <p className="text-[#334155] font-medium text-sm">media</p>
        </div>
      </div>
      <nav>
        <a href="/admin" className="px-4 py-2 flex gap-2  items-center text-[#09090b] font-normal text-sm">
          <Zap className="w-3 h-[13.3px]" />
          Hotels
        </a>
        <a href="/admin/guests" className="px-4 py-2 flex gap-2  items-center text-[#09090b] font-normal text-sm">
          <Zap className="w-3 h-[13.3px]" />
          Guests
        </a>
      </nav>
    </div>
  );
};

export default SidebarTop;
