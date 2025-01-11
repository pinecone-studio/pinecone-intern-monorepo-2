import * as React from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ReviewRating } from './StarsStaticJson';

type SelectHotelReviewRatingType = {
  setFieldValue: (_name: string, _value: number) => void;
  value: number;
};
const SelectHotelReviewRating = ({ setFieldValue, value }: SelectHotelReviewRatingType) => {
  const handleValueChange = (value: string) => {
    setFieldValue('rating', Number(value));
  };
  return (
    <Select defaultValue={String(value)} data-testid="Reveiw-Rating-Select" onValueChange={(e) => handleValueChange(e)}>
      <SelectTrigger data-cy="Review-Rating-Stars-Trigger" data-testid="Review-Rating-Stars-Trigger" className="w-full">
        <SelectValue data-testid="Jest-Rating" data-cy="Review-Rating-Stars" id="rating" placeholder="Select" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {ReviewRating.map((star) => (
            <SelectItem data-testid="Review-Rating-Items" data-cy={`Review-Rating-Item${star.value}`} key={star.value} value={String(star.value)}>
              {star.text}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default SelectHotelReviewRating;
