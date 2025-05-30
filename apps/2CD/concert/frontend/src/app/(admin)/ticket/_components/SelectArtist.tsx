'use client';

import { FormControl, FormItem, FormLabel } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGetArtistsQuery } from '@/generated';
import { useState } from 'react';

// eslint-disable-next-line no-unused-vars
export const SelcetArtist = ({ setValue, defaultValue }: { defaultValue: string[]; setValue: (defaultValue: string[]) => void }) => {
  const { data } = useGetArtistsQuery();
  const [selectValue, setSelectvalue] = useState('');
  const handleAddArtist = (value : string) => {
    setSelectvalue(value)
    setValue([...defaultValue, selectValue])
  }
  return (
    <FormItem>
      <FormLabel>артистын нэр*</FormLabel>
      <FormControl>
        <Select defaultValue={selectValue} onValueChange={handleAddArtist}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="артист нэмэх" />
          </SelectTrigger>
          <SelectContent>
            {data?.getArtists.map((artist) => (
              <SelectItem key={artist.id} value={artist.id}>
                {artist.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormControl>
    </FormItem>
  );
};
