import React, { Dispatch, SetStateAction } from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const SelectUserRating = ({ setSelectUserRating }: { setSelectUserRating: Dispatch<SetStateAction<number>> }) => {
  const handleSelect = (value: string) => {
    if (value == 'all') {
      setSelectUserRating(0);
      return;
    }
    setSelectUserRating(Number(value));
  };
  return (
    <div data-cy="User-Rating">
      <Select onValueChange={handleSelect}>
        <SelectTrigger data-cy="User-Trigger" className="w-full md:w-[180px]">
          <SelectValue data-cy="Selected-Value" placeholder="User Rating" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup data-cy="Select-Modal-Content">
            <SelectItem data-cy="Option-All" value="all">
              All
            </SelectItem>
            <SelectItem data-cy="Select-Nine" value="9">
              +9 Exellent
            </SelectItem>
            <SelectItem data-cy="Select-Eight" value="8">
              +8 Very good
            </SelectItem>
            <SelectItem data-cy="Select-Seven" value="7">
              +7 Good
            </SelectItem>
            <SelectItem data-cy="Select-Six" value="6">
              +6 better
            </SelectItem>
            <SelectItem data-cy="Select-five" value="5">
              +5 Normal
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectUserRating;
