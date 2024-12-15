import * as React from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RoomTypes } from './StarsStaticJson';

type SelectHotelStarsType = {
  setFieldValue: (_name: string, _value: string) => void;
};
const SelectRoomTypes = ({ setFieldValue }: SelectHotelStarsType) => {
  const handleValueChange = (value: string) => {
    setFieldValue('roomType', value);
  };

  return (
    <Select onValueChange={(e) => handleValueChange(e)}>
      <SelectTrigger data-testid="Select-Room-Type-Trigger" className="w-full" data-cy="Select-Room-Type-Trigger">
        <SelectValue data-cy="Selected-Room-Type-Value" id="roomType" placeholder="Select" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {RoomTypes.map((type, index) => (
            <SelectItem className="hover:cursor-pointer" data-cy={`Selected-Type${index}`} key={type} value={type}>
              {type}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default SelectRoomTypes;
