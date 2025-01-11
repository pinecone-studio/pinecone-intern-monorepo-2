import * as React from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RatingStars } from './StarsStaticJson';

type SelectHotelStarsType = {
  setFieldValue: (_name: string, _value: number) => void;
  value: number;
};
const SelectHotelStars = ({ setFieldValue, value }: SelectHotelStarsType) => {
  const handleValueChange = (value: string) => {
    setFieldValue('starsRating', Number(value));
  };

  return (
    <Select defaultValue={String(value)} onValueChange={(e) => handleValueChange(e)}>
      <SelectTrigger data-testid="Stars-Rating-Select-Trigger" className="w-full" data-cy="Stars-Rating-Select-Value1">
        <SelectValue data-cy="Stars-Rating-Select-Value" id="starsRating" placeholder="Select" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {RatingStars.map((star) => (
            <SelectItem data-cy={`Selected-Stars${star.value}`} key={star.value} value={String(star.value)}>
              {star.text}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default SelectHotelStars;
