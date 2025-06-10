'use client';

import { useController, Control } from 'react-hook-form';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

type CalendarInputProps = {
  name: string;
  control: Control<any>;
  labelText: string;
};

const CalendarInput = ({ name, control, labelText }: CalendarInputProps) => {
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({ name, control });

  return (
    <div className="flex flex-col w-full max-w-xs">
      <label className="mb-1 text-white font-medium">{labelText}</label>
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={`flex items-center justify-between w-full rounded-md border bg-zinc-900 px-3 py-2 text-left text-sm text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-600 ${
              error ? 'border-red-500' : 'border-zinc-700'
            }`}
          >
            {value ? format(value, 'yyyy-MM-dd') : <span className="text-gray-400">Select date</span>}
            <CalendarIcon className="ml-2 h-4 w-4 text-white" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar mode="single" selected={value} onSelect={onChange} initialFocus />
        </PopoverContent>
      </Popover>
      <p className="text-sm text-zinc-400 mt-2">Your date of birth is used to calculate your age.</p>
      {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
    </div>
  );
};

export default CalendarInput;
