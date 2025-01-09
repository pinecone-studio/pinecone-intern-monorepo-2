// _feature/GenderSelect.tsx
import React from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const GenderSelect: React.FC = () => (
  <div className="flex flex-col gap-2">
    <p className="text-sm text-zinc-950">Gender</p>
    <Select>
      <SelectTrigger className="w-full rounded-md border-zinc-400 border py-2 px-3">
        <SelectValue placeholder="Select gender (e.g., Male, Female, Custom)" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="Male">Male</SelectItem>
          <SelectItem value="Female">Female</SelectItem>
          <SelectItem value="Custom">Custom</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  </div>
);

export default GenderSelect;
