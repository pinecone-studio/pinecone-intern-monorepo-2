'use client';

import { DatePickerWithRange } from '../../app/DatePicker';
import { Button } from '@/components/ui/button';

import { useRouter } from 'next/navigation';
import { ComboboxDemo } from '@/app/(user)/(public)/header-filter/TravelerSelection';
import { useQueryState } from 'nuqs';

const HeaderFilter = () => {
  const [dateFrom] = useQueryState('dateFrom');
  const [dateTo] = useQueryState('dateTo');
  const [roomType] = useQueryState('roomType');
  const router = useRouter();

  return (
    <section
      data-testid="search-result-section"
      className="flex flex-col sm:flex-row md:flex-row bg-white items-center p-4 gap-2 mt-20 w-full max-w-[1200px] md:max-h-28 border-[3px] border-orange-200 rounded-xl"
    >
      <div className="flex flex-col w-full gap-2 md:w-auto">
        <p className="text-sm">Dates</p>
        <DatePickerWithRange />
      </div>
      <div className="flex flex-col w-full gap-2 md:w-auto">
        <p className="text-sm">Guest</p>
        <ComboboxDemo />
      </div>
      <Button
        onClick={() => router.push(`/search-result?dateFrom=${dateFrom ? dateFrom : ''}&dateTo=${dateTo ? dateTo : ''}&roomType=${roomType ? roomType : ''}`)}
        className="mt-4 bg-blue-700 md:w-48 md:mt-7 hover:bg-blue-500"
        data-testid="search-hotel-room-btn"
      >
        Search
      </Button>
    </section>
  );
};
export default HeaderFilter;
