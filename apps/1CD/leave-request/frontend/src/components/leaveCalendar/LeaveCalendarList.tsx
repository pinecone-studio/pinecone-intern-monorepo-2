/* eslint-disable complexity */
import { LeaveCalendarQuery } from '@/generated';
import { Calendar, Smile, Tag } from 'lucide-react';
import { RequestTimeCal, RequestType } from '../myreq/SentRequest';
import { useState } from 'react';

interface dayProps {
  __typename?: 'leaveCalendarType';
  _id: string;
  requests?: Array<{
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
  } | null> | null;
}

interface eleProps {
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

export const LeaveCalendarList = ({ data }: { data: LeaveCalendarQuery | undefined }) => {
  if (!data) return null;
  return (
    <div className="flex flex-col gap-5">{data.leaveCalendar ? [...data.leaveCalendar].reverse().map((ele) => <LeaveCalendarDay key={ele._id} data={ele} />) : <p>No leave data available</p>}</div>
  );
};

const LeaveCalendarDay = ({ data }: { data: dayProps }) => {
  const node = data.requests ? (
    <>
      {data.requests.map((ele, index) => (
        <LeaveCalendarEle key={data._id + index} data={ele} />
      ))}
    </>
  ) : (
    <NoRequest />
  );

  return (
    <div className="flex flex-col gap-1">
      <span className="text-[16px]">{data._id}</span>
      {node}
    </div>
  );
};

const NoRequest = () => {
  return (
    <div className="text-[#71717A] border-[#E4E4E7] bg-white rounded-[8px] py-5 flex flex-col gap-2 justify-center items-center">
      <span className="text-sm">Өнөөдөр чөлөө авсан хүн байхгүй байна.</span>
      <Smile size={16} />
    </div>
  );
};

const LeaveCalendarEle = ({ data }: { data: eleProps | null }) => {
  const [imageError, setImageError] = useState(false);
  if (!data) return null;

  const handleError = () => {
    setImageError(!imageError);
  };
  const { startTime, endTime, requestType, email } = data;

  return (
    <div className="px-6 py-5 flex gap-4 border-[#E4E4E7] border-[1px] bg-white rounded-[8px]">
      <img className="rounded-full object-cover h-14" width={56} height={14} src={(imageError && 'https://github.com/shadcn.png') || (email.profile as string)} onError={handleError} />
      <div className="flex flex-col gap-2">
        <span className="test-[#09090B] text-sm">{data.email.userName}</span>
        <span className="flex gap-2 items-center">
          <Calendar size={14} />

          <span>{startTime && `${startTime} - ${endTime}` || '09:00 - 18:00'}</span>

          <Tag size={16} className="ml-2" />
          <span>
            <RequestType requestType={requestType} /> <RequestTimeCal startTime={startTime} endTime={endTime} />
          </span>
        </span>
      </div>
    </div>
  );
};
