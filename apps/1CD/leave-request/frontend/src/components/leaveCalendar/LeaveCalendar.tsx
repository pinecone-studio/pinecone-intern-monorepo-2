'use client';

import { Button } from '@/components/ui/button';
import { ClientDatePicker } from '../myreq/DatePicker';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import { addDays } from 'date-fns';
import { LeaveCalendarList } from './LeaveCalendarList';
import { useLeaveCalendarQuery } from '@/generated';

export const LeaveCalendar = () => {
  const router = useRouter();
  const filter = useRef({
    startDate: addDays(new Date(), -30),
    endDate: addDays(new Date(), 365),
  });
  const { data, loading,  refetch } = useLeaveCalendarQuery({ variables: filter.current });
  if (loading) return null
  const refresh = async () => {
    await refetch(filter.current);
  };
  return (
    <div className="w-full max-w-[608px] m-auto mt-12 flex flex-col gap-4">
      <span className="text-xl font-semibold">Чөлөө авсан:</span>
      <div className="flex justify-between">
        <ClientDatePicker
          onChange={(e) => {
            if (e?.to && e?.from) {
              filter.current = { startDate: e?.from, endDate: e?.to };
              refresh();
            }
          }}
        />
        <Button
          onClick={() => {
            router.push('/createNewRequest');
          }}
        >
          + Чөлөө хүсэх
        </Button>
      </div>
      <LeaveCalendarList data={data} />
    </div>
  );
};
