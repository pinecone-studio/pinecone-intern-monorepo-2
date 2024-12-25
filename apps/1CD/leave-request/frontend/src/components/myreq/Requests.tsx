'use client';

import {  useGetAvailableRequestQuery } from '@/generated';
import { BadgeInfo } from 'lucide-react';
type RequestCardProps = {
  title: string;
  availableTime: string;
  description: string;
  icon?: React.ReactNode;
};

const RequestCard = ({ title, availableTime, description, icon }: RequestCardProps) => {
  return (
    <div className="w-[214px] h-[112px] border border-1 rounded-lg bg-white p-4 pl-6 m-0 relative" data-testid="work-from-distance">
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
const Requests = ({ email }: { email: string }) => {
  const { data, loading } = useGetAvailableRequestQuery({ variables: { email } });
  if (loading) return null;
  const { checkAvailablePaidLeaveInGivenYear, checkAvailavleRemoteLeaveInGivenMonth } = data!;

  return (
    <>
      <div className="w-[684PX] bg-[#F4F4F5] mx-auto flex justify-items-stretch gap-5 ">
        <div>
          <RequestCard
            title="Зайнаас ажиллах"
            availableTime={`${checkAvailavleRemoteLeaveInGivenMonth?.thisMonth || '-'} хоног`}
            description="боломжтой байна."
            icon={<BadgeInfo size={16} />}
            data-testid="work-from-distance"
          />
        </div>
        <div>
          <RequestCard
            title="Цалинтай чөлөө"
            availableTime={`${checkAvailablePaidLeaveInGivenYear?.thisYear || '-'} цаг`}
            description="боломжтой байна."
            icon={<BadgeInfo size={16} />}
            data-testid="paid-leave"
          />
        </div>
        <div>
          <RequestCard title="Чөлөө" availableTime="4 цагийн" description="чөлөө авсан байна" data-testid="leave" />
        </div>
      </div>
    </>
  );
};
export default Requests;
