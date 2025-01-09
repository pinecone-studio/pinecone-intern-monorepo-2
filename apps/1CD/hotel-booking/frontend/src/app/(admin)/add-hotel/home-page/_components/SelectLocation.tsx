import React, { Dispatch, SetStateAction } from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const StatusLocation = ({ setSelectedStatus }: { setSelectedStatus: Dispatch<SetStateAction<string>> }) => {
  const handleSelect = (value: string) => {
    if (value == 'all') {
      setSelectedStatus('');
      return;
    }
    setSelectedStatus(value);
  };
  return (
    <div data-cy="Filter-Location">
      <Select onValueChange={handleSelect}>
        <SelectTrigger data-cy="Location-Trigger" className="w-full md:w-[180px]">
          <SelectValue placeholder="Location" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup data-cy="Select-Modal-Content">
            <SelectItem data-cy="All" value="all">
              All
            </SelectItem>
            <SelectItem data-cy="Select-UB" value="ulaanbaatar">
              Ulaanbaatar
            </SelectItem>
            <SelectItem data-cy="Select-Darkhan" value="darkhan">
              Darkhan
            </SelectItem>
            <SelectItem data-cy="Select-Erdenet" value="erdenet">
              Erdenet
            </SelectItem>
            <SelectItem data-cy="Select-Omnogobi" value="omnogobi">
              Omno-Gobi
            </SelectItem>
            <SelectItem data-cy="Select-Govialtai" value="govialtai">
              Govi-Altai
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default StatusLocation;
