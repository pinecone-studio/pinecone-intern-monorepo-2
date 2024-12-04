'use client';
import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, ChevronRight, ChevronLeft } from 'lucide-react';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
const months: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const DatePickerButton: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState<number>(11);
  const [currentYear, setCurrentYear] = useState<number>(2024);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handlePrev = (): void => {
    setCurrentMonth((prevMonth) => {
      if (prevMonth === 0) {
        setCurrentYear((prevYear) => prevYear - 1);
        return 11; // December
      }
      return prevMonth - 1;
    });
  };

  const handleNext = (): void => {
    setCurrentMonth((prevMonth) => {
      if (prevMonth === 11) {
        setCurrentYear((prevYear) => prevYear + 1);
        return 0; // January
      }
      return prevMonth + 1;
    });
  };

  return (
    <div className="flex items-center gap-1">
      <Popover>
        <PopoverTrigger asChild>
          <button className="flex items-center justify-center w-10 h-10 p-2 bg-white border rounded-md hover:bg-gray-100" aria-label="Previous month">
            <ChevronLeft size={16} />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-40 p-2 text-center bg-white rounded-md shadow-md">
          <button onClick={handlePrev} className="px-4 py-2 text-sm font-medium bg-gray-100 rounded-lg hover:bg-gray-200">
            {months[currentMonth === 0 ? 11 : currentMonth - 1]} {currentMonth === 0 ? currentYear - 1 : currentYear}
          </button>
        </PopoverContent>
      </Popover>
      <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <PopoverTrigger asChild>
          <div className="flex items-center gap-2 px-4 py-2 border rounded-lg shadow-sm cursor-pointer bg-gray-50 hover:bg-gray-100">
            <CalendarIcon className="w-5 h-5 text-gray-500" />
            <span className="text-base font-medium">
              {months[currentMonth]} {currentYear}
            </span>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <CalendarComponent
            mode="single"
            selected={date}
            onSelect={(newDate) => {
              setDate(newDate);
              if (newDate) {
                setCurrentMonth(newDate.getMonth());
                setCurrentYear(newDate.getFullYear());
              }
              setIsCalendarOpen(false);
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger asChild>
          <button className="flex items-center justify-center w-10 h-10 p-2 bg-white border rounded-md hover:bg-gray-100" aria-label="Next month">
            <ChevronRight size={16} />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-40 p-2 text-center bg-gray-100 rounded-lg border-2 border-[#E4E4E7] hover:bg-gray-200">
          <button onClick={handleNext} className="px-4 py-2 text-sm font-medium bg-gray-100 rounded-lg hover:bg-gray-200">
            {months[currentMonth === 11 ? 0 : currentMonth + 1]} {currentMonth === 11 ? currentYear + 1 : currentYear}
          </button>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DatePickerButton;
