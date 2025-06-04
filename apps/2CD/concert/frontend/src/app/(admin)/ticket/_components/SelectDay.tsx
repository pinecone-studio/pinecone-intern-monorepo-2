'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { FormControl, FormItem, FormLabel } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
export const SelectDay = ({ day, setDay }: { day: Date | undefined; setDay: React.Dispatch<React.SetStateAction<Date | undefined>> }) => {
  return (
    <FormItem data-testid="form-item" className="flex flex-col">
      <FormLabel data-testid="form-label">Тоглолтын өдөр сонгох</FormLabel>
      <Popover data-testid="popover">
        <PopoverTrigger data-testid="popover-trigger" asChild>
          <FormControl data-testid="form-control">
            <Button data-testid="open-calendar-btn" variant={'outline'} className="w-[200px] pl-3 text-left font-normal">
              {day ? format(day, 'PPP') : <span data-testid="pick-date">Pick a date</span>}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent data-testid="popover-content" className="w-auto p-0" align="start">
          <Calendar mode="single" data-testid="calendar" selected={day} onSelect={setDay} disabled={(date) => date < new Date()} initialFocus />
        </PopoverContent>
      </Popover>
    </FormItem>
  );
};
