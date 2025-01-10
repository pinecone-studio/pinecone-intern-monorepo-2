'use client';

import { useState } from 'react';
import { ClientDatePicker } from '../myreq/DatePicker';
import RequestCategory from './RequestCategory';
import { CiSearch } from 'react-icons/ci';
import { addDays } from 'date-fns';

export interface filterProps {
  status?: string[];
  startDate: Date;
  endDate: Date;
  search?: string;
}

// eslint-disable-next-line no-unused-vars
const RequestHeader = ({ onChange, email }: {email: string, onChange: (arg0: filterProps) => void }) => {
  const [filter, setFilter] = useState<filterProps>({
    endDate: addDays(new Date(), 365),
    startDate: addDays(new Date(), -30),
    search: undefined,
    status: []
  });

  const updateFilter = (newFilter: Partial<filterProps>) => {
    const updatedFilter = { ...filter, ...newFilter };
    setFilter(updatedFilter);
    onChange?.(updatedFilter);
  };

  return (
    <div className="flex flex-col bg-[#f4f4f5]">
      <h3 className="font-semibold text-xl leading-7">Хүсэлтүүд</h3>
      <div className="flex justify-between items-center mt-5">
        <div className="h-10 flex gap-3">
          {/* Search Input */}
          <div className="flex gap-2 bg-white border-[1px] border-[#E4E4E7] items-center px-3 rounded-md">
            <CiSearch size={16} className="opacity-50" />
            <input type="text" placeholder="Хайлт" className="h-full text-[#71717A] text-sm leading-5" onChange={(e) => updateFilter({ search: e.target.value })} />
          </div>

          <RequestCategory
          email={email}
          filter={filter}
            onChange={(status) => {
              updateFilter({ status });
            }}
          />
        </div>

        <div>
          <ClientDatePicker
            onChange={(dateRange) => {
              if (dateRange?.from && dateRange?.to) {
                updateFilter({
                  startDate: dateRange.from,
                  endDate: dateRange.to,
                });
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default RequestHeader;
