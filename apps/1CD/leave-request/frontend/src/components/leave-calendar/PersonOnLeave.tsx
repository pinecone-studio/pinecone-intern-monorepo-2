'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Clock, Tag } from 'lucide-react';

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

  const formatedDate = date?.split('-').slice(1).join('-');
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
        return <PersonOnLeave key={index} {...request} />;
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

const PersonOnLeave = () => {
  return (
    <div className="w-[684px] h-[96px] border border-1 rounded-lg bg-white p-4 pl-6 m-0 flex flex-cols-2 gap-4">
      <div className=" flex-13">
        <Image className="rounded-full my-auto" src="" width={48} height={48} alt="Avatar" />
      </div>

      <div className=" flex-2/3">
        <div className="flex-1">A.Selenge </div>
        <div className="flex gap-6 mt-2">
          <div className="flex text-base gap-2 items-center">
            <Clock size={16} className="text-[#71717A]" />
            <div> 12:00 - 18:00</div>
          </div>
          <div className="flex items-center gap-2 text-base]">
            <Tag size={16} className="text-[#71717A]" />
            <div>Чөлөө (5 цаг)</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Accepted = () => {
  const router = useRouter();
  return (
    <>
      <div className="mt-[36px]">
        <div className="mt-4"> Өнөөдөр</div>
        <PersonOnLeave />
        <div className="mt-4"> Өчигдөр</div>
        <PersonOnLeave />
      </div>
    </>
  );
};
export default Accepted;