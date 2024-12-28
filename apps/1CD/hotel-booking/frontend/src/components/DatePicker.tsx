'use client';

import { useContext } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Context } from '@/app/(user)/(public)/layout';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const DatePickerWithRange = ({ className }: React.HTMLAttributes<HTMLDivElement>) => {
  const value = useContext(Context);
  return (
    <div data-testid="date-picker-modal" className={cn('grid gap-2 xl:min-w-[500px]', className)}>
      <Popover>
        <PopoverTrigger data-testid="trigger-test" asChild>
          <Button data-testid="date-picker-btn" id="date" variant={'outline'} className={cn('w-[500px] justify-between text-left font-normal')}>
            {value?.date?.from && value.date.to ? (
              <>
                {format(value.date.from, 'LLL dd, y')} - {format(value.date.to, 'LLL dd, y')}
              </>
            ) : (
              <>Please enter filter date</>
            )}

            <CalendarIcon className="w-4 h-4 ml-2 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className={cn('w-auto p-0', 'max-w-[600px]', 'overflow-x-auto')} align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={value?.date?.from}
            selected={value?.date}
            onSelect={value?.setDate}
            numberOfMonths={2}
            className={cn('max-w-full', 'overflow-x-auto', 'hidden md:block')}
          />
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={value?.date?.from}
            selected={value?.date}
            onSelect={value?.setDate}
            numberOfMonths={1}
            className={cn('max-w-full', 'overflow-x-auto', 'block md:hidden')}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
