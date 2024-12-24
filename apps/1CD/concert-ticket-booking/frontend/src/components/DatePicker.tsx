'use client';
import * as React from 'react';
import { format, parseISO } from 'date-fns';
import { Calendar as CalendarIcon, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useQueryState } from 'nuqs';
const DatePicker = () => {
  const [date, setDate] = useQueryState('date', { defaultValue: '' });
  const selectedDate = date ? parseISO(date) : undefined;

  const handleSelect = (day: Date | undefined) => {
    if (day) {
      setDate(day.toISOString());
    } else {
      setDate(null);
    }
  };
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={'outline'} className="bg-[#27272A] text-muted-foreground w-full border-gray-600 flex justify-between">
          <div className="flex items-center">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, 'PPP') : <span>Өдөр сонгох</span>}
          </div>
          <ChevronsUpDown className="w-4 h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={selectedDate} onSelect={handleSelect} initialFocus />
      </PopoverContent>
    </Popover>
  );
};
export default DatePicker;
