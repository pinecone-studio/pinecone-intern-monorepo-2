import React from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
const StatusSelect = () => {
  return (
    <div data-cy="Status-Filter-Modal">
      <Select>
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="apple">Booked</SelectItem>
            <SelectItem value="banana">Completed</SelectItem>
            <SelectItem value="blueberry">Cancelled</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default StatusSelect;
