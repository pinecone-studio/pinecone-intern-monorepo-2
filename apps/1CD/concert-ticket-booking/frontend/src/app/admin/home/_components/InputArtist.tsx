'use client';
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { useFieldArray } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { EventInputType } from '@/utils/validation-schema';
import { UseFormReturn } from 'react-hook-form';
type FormProps = {
  form: UseFormReturn<EventInputType>;
};
const InputArtist = ({ form }: FormProps) => {
  const {
    fields: mainArtistsFields,
    append: appendMainArtist,
    remove: removeMainArtist,
  } = useFieldArray({
    control: form.control,
    name: 'mainArtists',
  });
  const {
    fields: guestArtistsFields,
    append: appendGuestArtist,
    remove: removeGuestArtist,
  } = useFieldArray({
    control: form.control,
    name: 'guestArtists',
  });
  return (
    <div className="flex justify-between my-4">
      <div>
        {mainArtistsFields.map((item, index) => (
          <div key={index || item.id}>
            {index === 0 && (
              <FormField
                control={form.control}
                name={`mainArtists.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Үндсэн артистын нэр <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl className="my-2">
                      <div className="flex">
                        <Input className="w-[240px]" placeholder="Артистын нэр" {...field} data-testid={`main-artist-name-input-${index}`} />
                        <Button type="button" variant="secondary" onClick={() => removeMainArtist(index)} className="bg-inherit" data-testid={`remove-main-artist-button-${index}`}>
                          <X className="w-5" />
                        </Button>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            )}
            {index > 0 && (
              <FormField
                control={form.control}
                name={`mainArtists.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl className="my-2">
                      <div className="flex">
                        <Input className="w-[240px]" placeholder="Артистын нэр" {...field} data-testid={`main-artist-name-input-${index}`} />
                        <Button type="button" variant="secondary" onClick={() => removeMainArtist(index)} className="bg-inherit" data-testid={`remove-main-artist-button-${index}`}>
                          <X className="w-5" />
                        </Button>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            )}
          </div>
        ))}
        <Button type="button" onClick={() => appendMainArtist({ name: '' })} variant="outline" className="w-52 mt-1" data-testid="add-main-artist-button">
          артист нэмэх +
        </Button>
      </div>
      <div>
        {guestArtistsFields.map((item, index) => (
          <div key={index || item.id} className="flex items-end gap-3">
            {index === 0 && (
              <FormField
                control={form.control}
                name={`guestArtists.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Зочин артистын нэр</FormLabel>
                    <FormControl className="my-2">
                      <div className="flex">
                        <Input className="w-[240px]" placeholder="Артистын нэр" {...field} data-testid={`guest-artist-name-input-${index}`} />
                        <Button type="button" variant="secondary" onClick={() => removeGuestArtist(index)} className="bg-inherit" data-testid={`remove-guest-artist-button-${index}`}>
                          <X className="w-5" />
                        </Button>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            )}
            {index > 0 && (
              <FormField
                control={form.control}
                name={`guestArtists.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl className="my-2">
                      <div className="flex">
                        <Input className="w-[240px]" placeholder="Артистын нэр" {...field} data-testid={`guest-artist-name-input-${index}`} />
                        <Button type="button" variant="secondary" onClick={() => removeGuestArtist(index)} className="bg-inherit" data-testid={`remove-guest-artist-button-${index}`}>
                          <X className="w-5" />
                        </Button>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            )}
          </div>
        ))}
        <Button type="button" onClick={() => appendGuestArtist({ name: '' })} variant="outline" className="w-52 mt-1" data-testid="add-guest-artist-button">
          артист нэмэх +
        </Button>
      </div>
    </div>
  );
};
export default InputArtist;
