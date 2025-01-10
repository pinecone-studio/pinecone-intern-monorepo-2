import React from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const GenderSelect: React.FC = () => (
  <div className="flex flex-col gap-2">
    <p className="text-sm text-zinc-950">Gender</p>
    <Select>
      <SelectTrigger className="w-full rounded-md border-zinc-400 border py-2 px-3" data-cy="Gender-Select-Trigger">
        <SelectValue placeholder="Female" />
      </SelectTrigger>
      <SelectContent data-cy="Gender-Select-Content">
        <SelectGroup>
          <SelectItem value="Male" data-cy="Gender-Select-Male">Male</SelectItem>
          <SelectItem value="Female" data-cy="Gender-Select-Female">Female</SelectItem>
          <SelectItem value="Custom" data-cy="Gender-Select-Custom">Custom</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  </div>
);

export default GenderSelect;
