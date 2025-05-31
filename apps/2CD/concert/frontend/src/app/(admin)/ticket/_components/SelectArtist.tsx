'use client';

import { Button } from '@/components/ui/button';
import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGetArtistsQuery } from '@/generated';
import { Stack } from '@mui/material';
import { X } from 'lucide-react';
import { useState } from 'react';

// eslint-disable-next-line no-unused-vars
export const SelectArtist = ({ defaultValue, setValue }: { defaultValue: string[]; setValue: (val: string[]) => void }) => {
  const { data } = useGetArtistsQuery();
  const [artistNames, setArtistNames] = useState<{ id: string; name: string }[]>([]);
  const handleAddArtist = (artist: { id: string; name: string }) => {
    setArtistNames([...artistNames, artist]);
  };
  const handleAddArtistId = (artistId: string) => {
    if (!defaultValue.includes(artistId)) {
      setValue([...defaultValue, artistId]);
    }
  };
  const handleRemoveArtist = (id: string) => {
    const newValue = defaultValue.filter((s) => {
      return s !== id;
    });
    setValue(newValue);
  };
  return (
    <FormItem>
      <FormLabel>артистын нэр*</FormLabel>
      <Stack direction="row" gap={2}>
        <FormControl>
          <Select onValueChange={(value) => handleAddArtistId(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="артист нэмэх" />
            </SelectTrigger>
            <SelectContent>
              {data?.getArtists
                .filter((artist) => !defaultValue.some((a) => a === artist.id))
                .map((artist) => (
                  <SelectItem key={artist.id} value={artist.id} onClick={() => handleAddArtist(artist)}>
                    {artist.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </FormControl>
        {data?.getArtists
          .filter((art) => defaultValue.find((a) => a === art.id))
          .map((art) => (
            <Stack direction="row" key={art.id} gap={0.65}>
              <Button className="rounded-full p-2 py-1 text-sm" variant="secondary" onClick={() => handleRemoveArtist(art.id)} type="button">
                {art.name} <X size={16} />
              </Button>
            </Stack>
          ))}
      </Stack>
      <FormMessage />
    </FormItem>
  );
};
