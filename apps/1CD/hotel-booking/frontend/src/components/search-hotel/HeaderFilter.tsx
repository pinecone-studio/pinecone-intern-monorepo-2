'use client';
import { ComboboxDemo } from '@/app/(public)/header-filter/TravelerSelection';
import { DatePickerWithRange } from '../DatePicker';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { DateRange } from 'react-day-picker';

const HeaderFilter = () => {
  const [date, setDate] = useState<DateRange | undefined>();
  return (
    <section
      data-testid="search-result-section"
      className="flex flex-col md:flex-row bg-white items-center p-4 gap-3 mt-20 w-full max-w-[1200px] md:max-h-28 border-[3px] border-orange-200 rounded-xl"
    >
      <div className="flex flex-col w-full gap-2 md:w-auto">
        <p className="text-sm">Dates</p>
        <DatePickerWithRange setDate={setDate} date={date} />
      </div>
      <div className="flex flex-col w-full gap-2 md:w-auto">
        <p className="text-sm">Guest</p>
        <ComboboxDemo />
      </div>
      <Button className="mt-4 bg-blue-700 md:w-60 md:mr-5 md:mt-7" data-testid="search-hotel-room-btn">
        Search
      </Button>
    </section>
  );
};
export default HeaderFilter;
