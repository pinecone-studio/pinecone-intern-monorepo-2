/* eslint-disable no-unused-vars */
'use client';

import { Button } from '@/components/ui/button';
import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Stack } from '@mui/material';
import { X } from 'lucide-react';
export const SelectArtist = ({
  defaultValue,
  setValue,
  artists,
}: {
  artists:
    | {
        __typename?: 'Artist';
        id: string;
        name: string;
        avatarImage: string;
      }[]
    | undefined;
  defaultValue: string[];
  setValue: (val: string[]) => void;
}) => {
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
    <FormItem data-testid="form-item">
      <FormLabel data-testid="form-label">артистын нэр*</FormLabel>
      <Stack direction="row" gap={2}>
        <FormControl data-testid="form-control">
          <Select data-testid="select" onValueChange={(value) => handleAddArtistId(value)}>
            <SelectTrigger data-testid="select-trigger" data-cy="select-trigger-artist" className="w-[180px]">
              <SelectValue data-testid="select-value" placeholder="артист нэмэх" />
            </SelectTrigger>
            <SelectContent>
              {artists
                ?.filter((artist) => !defaultValue.some((a) => a === artist.id))
                .map((artist) => (
                  <SelectItem data-testid={`select-artist-${artist.id}`} key={artist.id} value={artist.id}>
                    {artist.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </FormControl>
        {artists
          ?.filter((art) => defaultValue.find((a) => a === art.id))
          .map((art) => (
            <Stack direction="row" key={art.id} gap={0.65}>
              <Button data-testid={`remove-artist-${art.id}`} className="rounded-full p-2 py-1 text-sm" variant="secondary" onClick={() => handleRemoveArtist(art.id)} type="button">
                {art.name} <X size={16} />
              </Button>
            </Stack>
          ))}
      </Stack>
      <FormMessage data-testid="form-message" />
    </FormItem>
  );
};
