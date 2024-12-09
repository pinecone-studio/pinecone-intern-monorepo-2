import * as React from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Countries } from './StarsStaticJson';

type SelectCountryType = {
  setFieldValue: (_name: string, _value: string) => void;
};
const SelectCountry = ({ setFieldValue }: SelectCountryType) => {
  const handleValueChange = (value: string) => {
    setFieldValue('country', value);
  };

  return (
    <Select onValueChange={(e) => handleValueChange(e)}>
      <SelectTrigger data-testid="Country-Select-Trigger" className="w-full" data-cy="Country-Select-Value">
        <SelectValue id="country" placeholder="Hong Kong" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {Countries.map((country, index) => (
            <SelectItem data-cy={`Selected-country${index}`} key={country.text} value={country.value}>
              {country.text}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default SelectCountry;
