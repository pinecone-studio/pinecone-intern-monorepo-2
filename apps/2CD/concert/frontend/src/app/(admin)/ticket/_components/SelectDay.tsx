'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
export const SelectDay = ({ day, setDay }: { day: Date | undefined; setDay: React.Dispatch<React.SetStateAction<Date | undefined>> }) => {
  return (
    <FormItem className="flex flex-col">
      <FormLabel>Date of birth</FormLabel>
      <Popover>
        <PopoverTrigger asChild>
          <FormControl>
            <Button variant={'outline'} className="w-[200px] pl-3 text-left font-normal">
              {day ? format(day, 'PPP') : <span>Pick a date</span>}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar mode="single" selected={day} onSelect={setDay} disabled={(date) => date < new Date()} initialFocus />
        </PopoverContent>
      </Popover>
      <FormMessage />
    </FormItem>
  );
};
