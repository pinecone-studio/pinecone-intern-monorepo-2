'use client';

import { useEffect, useState } from 'react';
import { ClientDatePicker } from '../myreq/DatePicker';
import RequestCategory from './RequestCategory';
import { CiSearch } from 'react-icons/ci';
import { addDays } from 'date-fns';

interface filterProps {
  status?: string[];
  startDate: Date;
  endDate: Date;
  search?: string;
}

// eslint-disable-next-line no-unused-vars
const RequestHeader = ({ onChange }: { onChange: (arg0: filterProps) => void }) => {
  const [filter, setFilter] = useState<filterProps>({ endDate: new Date(), startDate: addDays(new Date(), -30) });
  useEffect(() => {
    onChange(filter)
    }, [filter])
  return (
    <div className="flex flex-col bg-[#f4f4f5]">
      <h3 className="font-semibold text-xl leading-7">Хүсэлтүүд</h3>
      <div className="flex justify-between items-center mt-5">
        <div className="h-10 flex gap-3">
          <div className="flex gap-2 bg-white border-[1px] border-[#E4E4E7] items-center px-3 rounded-md">
            <CiSearch size={16} className="opacity-50" />
            <input type="text" placeholder="Хайлт" className="h-full text-[#71717A] text-sm leading-5" onChange={(e) => setFilter({ ...filter, search: e.target.value })} />
          </div>
          <RequestCategory
            onChange={(e) => {
              setFilter({ ...filter, status: e });
            }}
          />
        </div>
        <div>
          <ClientDatePicker
            onChange={(arg0) => {
              if (arg0?.from && arg0.to) setFilter({ ...filter, startDate: arg0?.from, endDate: arg0?.to });
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default RequestHeader;
