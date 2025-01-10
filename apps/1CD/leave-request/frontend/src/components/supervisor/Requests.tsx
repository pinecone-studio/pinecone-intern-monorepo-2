'use client';

// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import Image from 'next/image';

import RequestDetail from './RequestDetail';
import RequestHeader from './RequestHeader';
import RequestList from './RequestList';
import { useState } from 'react';
import { addDays } from 'date-fns';
import { GetRequestBySupervisor } from '@/context/GetAllRequestBySupervisorContext';

interface filterProps {
  status?: string[];
  startDate: Date;
  endDate: Date;
  search?: string;
}

const Requests = ({ email }: { email: string }) => {
  const [filter, setFilter] = useState<filterProps>({ endDate: addDays(new Date(), 365), startDate: addDays(new Date(), -30) });

  return (
    <div className="flex flex-col bg-[#f4f4f5] mt-11">
      <div className="w-[1030px] mx-auto mt-10">
        <RequestHeader
        email={email}
          onChange={(arg) => {
            setFilter(arg);
          }}
        />
        <div className="mt-5 flex gap-2">
          <GetRequestBySupervisor filter={filter} email={email}>
            <RequestList />
            <RequestDetail />
          </GetRequestBySupervisor>
        </div>
      </div>

      <div className="h-[60px] w-full bg-[#f4f4f5] flex items-center justify-center text-sm text-[#3F4145] mt-[44px]">©2024 Copyright</div>
    </div>
  );
};

export default Requests;
