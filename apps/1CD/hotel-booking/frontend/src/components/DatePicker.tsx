'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
type DatePickerProps = {
  date: DateRange | undefined;
  setDate: (_value: DateRange | undefined) => void;
};
type DatePickerWithRangeType = DatePickerProps & React.HTMLAttributes<HTMLDivElement>;
export const DatePickerWithRange = ({ className, date, setDate }: DatePickerWithRangeType) => {
  return (
    <div data-testid="date-picker-modal" className={cn('grid gap-2 xl:min-w-[500px]', className)}>
      <Popover>
        <PopoverTrigger data-testid="trigger-test" asChild>
          <Button data-testid="date-picker-btn" id="date" variant={'outline'} className={cn('w-[500px] justify-between text-left font-normal')}>
            {date?.from && date.to ? (
              <>
                {format(date.from, 'LLL dd, y')} - {format(date.to, 'LLL dd, y')}
              </>
            ) : (
              <>
                {format(new Date(), 'LLL dd, y')} - {format(new Date(), 'LLL dd, y')}
              </>
            )}

            <CalendarIcon className="w-4 h-4 ml-2 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className={cn('w-auto p-0', 'max-w-[500px]', 'overflow-x-auto')} align="start">
          <Calendar initialFocus mode="range" defaultMonth={date?.from} selected={date} onSelect={setDate} numberOfMonths={2} className={cn('max-w-full', 'overflow-x-auto', 'hidden md:block')} />
          <Calendar initialFocus mode="range" defaultMonth={date?.from} selected={date} onSelect={setDate} numberOfMonths={1} className={cn('max-w-full', 'overflow-x-auto', 'block md:hidden')} />
        </PopoverContent>
      </Popover>
    </div>
  );
};
