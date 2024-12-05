import { BadgeInfo } from 'lucide-react';
type RequestCardProps = {
  title: string;
  availableTime: string;
  description: string;
  icon?: React.ReactNode; // Optionally include an icon
};
const RequestCard = ({ title, availableTime, description, icon }: RequestCardProps) => {
  return (
    <div className="w-[214px] h-[112px] border border-1 rounded-lg bg-white p-4 pl-6 relative">
      <div className=" flex  justify-between">
        <div className="text-sm ">{title}</div>
        <div className=" text-sm">{icon && <div className="text-sm">{icon}</div>}</div>
      </div>
      <div className="absolute ">
        <div className="text-2xl mt-2"> {availableTime}</div>
        <div className=" text-sm text-[#71717A]">{description}</div>
      </div>
    </div>
  );
};
const Requests = () => {
  return (
    <>
      <div className="w-[684PX] bg-[#F4F4F5] mx-auto flex">
        <div className="  gap-4 grid grid-cols-3 ">
          <RequestCard title="Зайнаас ажиллах" availableTime="3 хоног" description="боломжтой байна." icon={<BadgeInfo size={16} />} />
        </div>
        <div className="  gap-4 grid grid-cols-3 ">
          <RequestCard title="Цалинтай чөлөө" availableTime="4 хоног" description="боломжтой байна." icon={<BadgeInfo size={16} />} />
        </div>
        <div className="  gap-4 grid grid-cols-3 ">
          <RequestCard title="Чөлөө" availableTime="4 цагийн" description="чөлөө авсан байна" />
        </div>
      </div>
    </>
  );
};
export default Requests;
