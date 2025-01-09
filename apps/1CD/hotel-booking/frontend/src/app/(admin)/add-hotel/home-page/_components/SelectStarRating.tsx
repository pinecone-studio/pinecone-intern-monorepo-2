import React, { Dispatch, SetStateAction } from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
const SelectStarRating = ({ setSelectStarRating }: { setSelectStarRating: Dispatch<SetStateAction<number>> }) => {
  return (
    <div data-cy="Star-Rating-Input">
      <Select onValueChange={(value) => setSelectStarRating(Number(value))}>
        <SelectTrigger data-cy="Star-Trigger" className="w-full md:w-[180px]">
          <SelectValue placeholder="Star Rating" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup data-cy="Select-Modal-Content">
            <SelectItem data-cy="Select-All" value="0">
              All
            </SelectItem>
            <SelectItem data-cy="Select-Five" value="5">
              5 star
            </SelectItem>
            <SelectItem data-cy="Select-Four" value="4">
              4 star
            </SelectItem>
            <SelectItem data-cy="Select-Three" value="3">
              3 star
            </SelectItem>
            <SelectItem data-cy="Select-Two" value="2">
              2 star
            </SelectItem>
            <SelectItem data-cy="Select-One" value="1">
              1 star
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectStarRating;
