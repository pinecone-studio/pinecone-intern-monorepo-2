// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Image from 'next/image';
import { MdOutlineDateRange } from 'react-icons/md';
import { GoTag } from 'react-icons/go';
import { GoDotFill } from 'react-icons/go';
import { FaAngleLeft } from 'react-icons/fa6';
import { FaAngleRight } from 'react-icons/fa6';
import { format, formatDistance } from 'date-fns';
import { data } from 'cypress/types/jquery';

interface dataProps {
  __typename?: 'RequestTypePop';
  _id: string;
  requestType: string;
  message: string;
  requestDate: Date;
  startTime: string;
  endTime: string;
  supervisorEmail: string;
  result: string;
  optionalFile: string;
  email: {
    __typename?: 'User';
    _id: string;
    email: string;
    userName: string;
    profile: string;
    role: string;
    position: string;
    supervisor: Array<string | null>;
    hireDate: Date;
  };
}

const RequestList = ({ data }: { data: dataProps[] | null | undefined }) => {
  if (!data) {
    return null;
  }
  return (
    <div className="flex flex-col w-[414px]">
      <div className="flex flex-col gap-3">
        <div className="flex px-4 py-3 justify-between bg-white border-[1px] border-[#E4E4E7] rounded-[8px]">
          <div className="flex items-center">
            <Image src="/Avatar.png" width={48} height={48} alt="Avatar" />
            <div className="text-xs text-[#71717A] ml-3">
              <div className="flex items-center gap-[6px]">
                <p className="text-sm text-[#09090B]">B.Enkhjin</p>
                <p className="">23</p>
              </div>
              <div className="flex mt-[6px] gap-[2px] items-center">
                <GoTag size={14} />
                <div className="flex gap-[2px]">
                  <p>Чөлөө</p>
                  <p>(1 цаг)</p>
                </div>
              </div>
              <div className="flex items-center gap-[2px] mt-1">
                <MdOutlineDateRange size={14} />
                <div className="flex gap-[2px]">
                  <p>2024/10/25</p>
                  <p>(9:00-11:00)</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-[#F97316] bg-opacity-20 rounded-full px-[10px] py-[2px] text-xs text-[#18181B] h-5">Хүлээгдэж байна</div>
        </div>
        {/* map */}
        {data.map((ele) => (
          <SingleItem key={ele._id} item={ele} />
        ))}

        <div className="flex px-4 py-3 justify-between">
          
          <div className="bg-[#18BA51] bg-opacity-20 rounded-full px-[10px] py-[2px] text-xs text-[#18181B] h-5">Баталгаажсан</div>
        </div>
      </div>
      <div className="flex items-center gap-4 pt-4">
        <p className="text-xs text-[#71717A]">1-10 хүсэлт (Нийт: 20)</p>
        <div className="flex gap-4">
          <FaAngleLeft size={8} />
          <FaAngleRight size={8} />
        </div>
      </div>
    </div>
  );
};

const SingleItem = ({ item }: { item: dataProps }) => {
  return (
    <div className="flex px-4 py-3 justify-between items-center">
      <div className="flex items-center">
        <Image className="rounded-full" src={item.email.profile} width={48} height={48} alt="Avatar" />
        <div className="text-xs text-[#09090B] ml-3">
          <div className="flex items-center gap-[6px]">
            <p className="text-sm text-[#09090B]">{item.email.userName}</p>
            <p className="text-[#2563EB]">{formatDistance(item.requestDate, new Date())}</p>
          </div>
          <div className="flex mt-[6px] gap-[2px] items-center">
            <GoTag size={14} />
            <div className="flex gap-[2px]">
              <p className="flex gap-1">
                <span>
                  <RequestType requestType={item.requestType} />
                </span>
                <RequestTimeCal startTime={item.startTime} endTime={item.endTime} />
              </p>
            </div>
          </div>
          <div className="flex items-center gap-[2px] mt-1">
            <MdOutlineDateRange size={14} />
            <p>{format(new Date(item.requestDate), 'yyyy/MM/dd')}</p>
            {item.startTime && <p>({item.startTime}-{item.endTime})</p>}
          </div>
        </div>
      </div>
      {/* <div className='bg-[#F97316] bg-opacity-20 rounded-full px-[10px] py-[2px] text-xs text-[#18181B] h-5'>Хүлээгдэж байна</div> */}
      <GoDotFill color="#2563EB" />
    </div>
  );
};

const RequestType = ({ requestType }: { requestType?: string | null }) => {
  return (requestType == 'paid' && 'Цалинтай чөлөө') || (requestType == 'remote' && 'Зайнаас ажиллах') || 'Чөлөө';
};
const RequestTimeCal = ({ startTime, endTime }: { startTime: string; endTime: string }) => {
  if (!startTime || !endTime) return '(1 хоног)';
  const findHourGap = (hour1: string, hour2: string) => {
    const gap = Number(hour1.split(':')[0]) - Number(hour2.split(':')[0]);
    return gap;
  };
  const hours = findHourGap(endTime, startTime);
  return <span>({hours} цаг)</span>;
};

export default RequestList;
