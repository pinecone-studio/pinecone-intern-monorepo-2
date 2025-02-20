// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MdOutlineDateRange } from 'react-icons/md';
import { GoTag } from 'react-icons/go';
import { GoDotFill } from 'react-icons/go';
import { FaAngleLeft } from 'react-icons/fa6';
import { FaAngleRight } from 'react-icons/fa6';
import { format, formatDistance } from 'date-fns';
import { useRouter, useSearchParams } from 'next/navigation';

export interface dataProps {
  __typename?: 'RequestTypePop';
  _id: string;
  requestType: string;
  message: string;
  requestDate: any;
  startTime: any;
  endTime: any;
  supervisorEmail: string;
  result: string;
  optionalFile: string;
  email: {
    __typename?: 'User';
    _id: string;
    email: string;
    userName: string;
    profile?: string | null;
    role: string;
    position: string;
    supervisor: Array<string | null>;
    hireDate: any;
    createdAt: any;
    updatedAt: any;
  };
}

import { useGetAllRequestSupervisor } from '@/context/GetAllRequestBySupervisorContext';
import { Loader } from '@/context/SecurePageWrapper';

// eslint-disable-next-line complexity
const RequestList = () => {
  const { data, reload, page, setPage, loading } = useGetAllRequestSupervisor();

  if (!data || !data.getAllRequestLength.res) {
    return null;
  }

  if (loading) {
    return <Loader />;
  }

  const maxPage = Math.ceil(Number(data.getAllRequestLength.res / 10));
  return (
    <div className="flex flex-col w-[414px]">
      <div className="flex flex-col gap-3">
        {data.getAllRequestsBySupervisor?.map((ele) => (
          <SingleItem key={ele._id} item={ele} refetch={reload} />
        ))}
      </div>
      <div className="flex items-center gap-4 pt-4">
        <p className="text-xs text-[#71717A]">
          {(page - 1) * 10 + 1}-{(page - 1) * 10 + ((maxPage == page && data.getAllRequestLength.res % 10) || 10)} хүсэлт (Нийт: {data.getAllRequestLength.res})
        </p>
        <div className="flex gap-4">
          <FaAngleLeft
            className="cursor-pointer"
            size={8}
            onClick={() => {
              if (page > 1) setPage(page - 1);
            }}
          />
          <FaAngleRight
            className="cursor-pointer"
            size={8}
            onClick={() => {
              if (page < maxPage) setPage(page + 1);
            }}
          />
        </div>
      </div>
    </div>
  );
};

// eslint-disable-next-line complexity
const SingleItem = ({ item, refetch }: { item: dataProps; refetch: () => void }) => {
  const router = useRouter();
  const params = useSearchParams();
  const clicked = params.get('id') == item._id;
  return (
    <div
      className={`flex px-4 py-3 justify-between items-center ${clicked && 'bg-white border-[1px] border-[#E4E4E7]'}`}
      onClick={() => {
        refetch();
        router.push(`?id=${item._id}`);
      }}
    >
      <div className="flex items-center">
        <img className="rounded-full" src={item.email.profile as string} width={48} height={48} alt="Avatar" />
        <div className="text-xs text-[#09090B] ml-3">
          <div className="flex items-center gap-[6px]">
            <p className="text-sm text-[#09090B]">{item.email.userName}</p>
            <p className={`text-[#2563EB] ${clicked && 'text-[#71717A]'}`}>{formatDistance(item.requestDate, new Date())}</p>
          </div>
          <div className={`flex mt-[6px] gap-[2px] items-center ${clicked && 'text-[#71717A]'}`}>
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
          <div className={`flex mt-[6px] gap-[2px] items-center ${clicked && 'text-[#71717A]'}`}>
            <MdOutlineDateRange className="text-[#09090B80]" size={14} />
            <p>{format(new Date(item.requestDate), 'yyyy/MM/dd')}</p>
            {item.startTime && (
              <p>
                ({item.startTime}-{item.endTime})
              </p>
            )}
          </div>
        </div>
      </div>
      <Pin result={item.result} />
    </div>
  );
};

export const Pin = ({ result = 'pending' }: { result?: string | null }) => {
  if (result == 'sent') return <GoDotFill color="#2563EB" />;
  if (result == 'pending') return <div className="bg-[#F97316] bg-opacity-20 rounded-full px-[10px] py-[2px] text-xs text-[#18181B] h-5">Хүлээгдэж байна</div>;
  if (result == 'success') return <div className="bg-[#18BA51] bg-opacity-20 rounded-full px-[10px] py-[2px] text-xs text-[#18181B] h-5">Баталгаажсан</div>;
  return <div className="bg-[#E11D4833] rounded-full px-[10px] py-[2px] text-xs text-[#18181B] h-5">Татгалзсан</div>;
};
export const RequestType = ({ requestType }: { requestType?: string | null }) => {
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
