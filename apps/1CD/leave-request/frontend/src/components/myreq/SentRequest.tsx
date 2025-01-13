'use client';
import { Button } from '@/components/ui/button';
import { ClientDatePicker } from './DatePicker';
import { useGetRequestsQuery } from '@/generated';
import { Calendar, Tag } from 'lucide-react';
import { addDays, format, formatDate } from 'date-fns';
import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Loader } from '@/context/SecurePageWrapper';

interface requestProps {
  _id: string;
  email?: string | null;
  requestType?: string | null;
  message?: string | null;
  requestDate?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  supervisorEmail?: string | null;
  result?: string | null;
  comment?: string | null;
  optionalFile?: string | null;
}

const RequestGroup = ({ date, requests }: { date?: string; requests: Array<requestProps | null> | null }) => {
  if (!requests || !date) {
    return null;
  }
  const formatedDate = formatDate(new Date(date), 'MM-dd');
  const dateObj = new Date(date).setHours(0, 0, 0, 0);
  const today = new Date().setHours(0, 0, 0, 0);
  const gap = Math.abs(dateObj - today) / (1000 * 60 * 60 * 24);
  return (
    <div className="w-[684px]">
      <div className="flex gap-2 mb-1">
        <h1 className="text-[#09090B] text-[16px]">{formatedDate}</h1>
        <span>
          <RelativeDateNote gap={gap} />
        </span>
      </div>
      {requests?.map((request, index) => {
        if (!request) return null;
        return <RequestItem key={index} {...request} />;
      })}
    </div>
  );
};

const RelativeDateNote = ({ gap }: { gap: number }) => {
  if (gap == 1) return 'Маргааш';
  if (gap == 0) return 'Өнөөдөр';
  if (gap == -1) return 'Өчигдөр';
  return;
};

const RequestItem = ({ requestType, result, startTime, endTime, requestDate }: requestProps) => {
  if (!requestDate) return null;
  return (
    <div className="bg-white flex flex-col gap-2 mb-4 rounded-[8px] border-[1px] border-[#E4E4E7] p-6">
      <div className="flex gap-2 items-center">
        <Tag size={16} />
        <span className="text-[#09090B] text-sm">
          <RequestType requestType={requestType} /> <RequestTimeCal startTime={startTime} endTime={endTime} />
        </span>
        <Status result={result} />
      </div>
      <div className="flex gap-2 items-center">
        <Calendar size={16} />
        <span className="text-[#09090B] text-sm">
          {format(new Date(requestDate), 'yyyy/MM/dd')} {startTime && `(${startTime} - ${endTime})`}
        </span>
      </div>
    </div>
  );
};

export const RequestType = ({ requestType }: { requestType?: string | null }) => {
  return (requestType == 'paid' && 'Цалинтай чөлөө') || (requestType == 'remote' && 'Зайнаас ажиллах') || 'Чөлөө';
};

export const RequestTimeCal = ({ startTime, endTime }: { startTime: requestProps['startTime']; endTime: requestProps['endTime'] }) => {
  if (!startTime || !endTime) return '(1 хоног)';
  const findHourGap = (hour1: string, hour2: string) => {
    const gap = Number(hour1.split(':')[0]) - Number(hour2.split(':')[0]);
    return gap;
  };
  const hours = findHourGap(endTime, startTime);
  return `(${hours} цаг)`;
};

const Status = ({ result }: { result?: string | null }) => {
  const colorPicker = () => {
    return (result == 'success' && '#18BA5133') || (result == 'fail' && '#E11D4833') || '#F9731633';
  };
  const textPicker = () => {
    return (result == 'success' && 'Баталгаажсан') || (result == 'fail' && 'Татгалзсан') || 'Хүлээгдэж байна';
  };
  const text = textPicker();
  const color = colorPicker();
  return <div className={`rounded-full px-[10px] py-[2px] text-[12px] text-[#18181B]`} style={{background: color}}>{text}</div>;
};

const SentRequest = ({ email }: { email: string }) => {
  const dateRange = useRef({
    startDate: addDays(new Date(), -30),
    endDate: addDays(new Date(), 365),
  });
  const router = useRouter();
  const { data, loading, refetch } = useGetRequestsQuery({ variables: { email, ...dateRange.current } });

  if (loading) {
    return <Loader/>;
  }
  const refresh = async () => {
    await refetch({ email, ...dateRange.current });
  };

  return (
    <div className="w-[684PX] bg-[#F4F4F5] mx-auto pt-10">
      <h1 className="font-bold text-2xl">Миний явуулсан хүсэлтүүд:</h1>
      <div className="mt-6 flex justify-between">
        <ClientDatePicker
          onChange={(e) => {
            if (e?.to && e?.from) {
              dateRange.current = { startDate: e?.from, endDate: e?.to };
              refresh();
            }
          }}
        />
        <Button
          onClick={() => {
            router.push('/createNewRequest');
          }}
        >
          + Чөлөө хүсэх
        </Button>
      </div>

      <div className="py-6 rounded-lg text-[#71717A]">
        {data?.getRequests?.length ? (
          data.getRequests.map((group, index) => {
            if (!group || !group.requests) {
              return null;
            }
            return <RequestGroup key={index} date={group._id} requests={group.requests} />;
          })
        ) : (
          <div className="mt-28">
              <p className=" font-bold text-center text-black"> Чөлөөний хүсэлт байхгүй байна.</p>
              <p className="text-center">Чөлөөний хүсэлтээ үүсгэхээр энд харагдана. </p>
         </div>
        )}
      </div>
    </div>
  );
};

export default SentRequest;

