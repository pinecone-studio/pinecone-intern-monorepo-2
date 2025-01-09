import React, { Dispatch, SetStateAction } from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
const SelectRooms = ({ setSelectRooms }: { setSelectRooms: Dispatch<SetStateAction<string>> }) => {
  const handleSelect = (value: string) => {
    if (value == 'all') {
      setSelectRooms('');
      return;
    }
    setSelectRooms(value);
  };
  return (
    <div data-cy="Status-Filter-Modal">
      <Select onValueChange={handleSelect}>
        <SelectTrigger data-cy="Room-Trigger" className="w-full md:w-[180px]">
          <SelectValue placeholder="Rooms" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup data-cy="Select-Modal-Content">
            <SelectItem data-cy="Select-All-Rooms" value="all">
              All Rooms
            </SelectItem>
            <SelectItem data-cy="Select-standard" value="1bed">
              1bed
            </SelectItem>
            <SelectItem data-cy="Select-Single-Room" value="2beds">
              2beds
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectRooms;
