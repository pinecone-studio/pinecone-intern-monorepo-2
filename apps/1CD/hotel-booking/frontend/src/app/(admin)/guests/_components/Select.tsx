'use client';
import React, { Dispatch, SetStateAction } from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
const StatusSelect = ({ setSelectedStatus }: { setSelectedStatus: Dispatch<SetStateAction<string>> }) => {
  return (
    <div data-cy="Status-Filter-Modal">
      <Select onValueChange={(value) => setSelectedStatus(value)}>
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup data-cy="Select-Modal-Content">
            <SelectItem data-cy="Select-All" value="all">
              All
            </SelectItem>
            <SelectItem data-cy="Select-Booked" value="booked">
              Booked
            </SelectItem>
            <SelectItem data-cy="Select-Completed" value="completed">
              Completed
            </SelectItem>
            <SelectItem data-cy="Select-Cancelled" value="cancelled">
              Cancelled
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default StatusSelect;
