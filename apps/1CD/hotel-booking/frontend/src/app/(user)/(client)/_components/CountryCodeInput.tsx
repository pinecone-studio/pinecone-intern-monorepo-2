'use client';

import * as React from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const inputs = [
  { countryCode: '+976', countryName: 'Mongolia' },
  { countryCode: '+1', countryName: 'United States' },
  { countryCode: '+91', countryName: 'India' },
  { countryCode: '+44', countryName: 'United Kingdom' },
  { countryCode: '+81', countryName: 'Japan' },
  { countryCode: '+49', countryName: 'Germany' },
];

const CountryCodeInput = () => {
  return (
    <Select>
      <SelectTrigger className="w-[5rem]">
        <SelectValue placeholder="+976" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup className="w-[5rem]">
          {inputs.map((input) => (
            <SelectItem key={input.countryCode} value={input.countryName}>
              {input.countryCode}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default CountryCodeInput;
