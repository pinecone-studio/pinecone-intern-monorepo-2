import { Smile } from 'lucide-react';

const TodayNoLeaveRequest = () => {
  return (
    <div className="w-[608px] h-[84px] border border-1 rounded-lg bg-white mx-auto p-6 flex flex-col gap-2">
      <div className="text-sm text-center text-[#71717A]">Өнөөдөр чөлөө авсан хүн байхгүй байна.</div>
      <div className="text-sm text-center text-[#71717A] items-center flex justify-center">
        <Smile size={16} />
      </div>
    </div>
  );
};

export default TodayNoLeaveRequest;