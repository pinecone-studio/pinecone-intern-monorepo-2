'use client';
import DetailTop from '@/components/detail/DetailTop';
import EventDetail from '@/components/detail/EventDetail';
import TicketDetail from '@/components/detail/TicketDetail';

import { Event, useGetEventByIdLazyQuery } from '@/generated';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';

const Page = () => {
  const [getEvents1, { data, loading }] = useGetEventByIdLazyQuery();
  const params = useParams();
  const { eventId } = params;
  useEffect(() => {
    getEvents1({
      variables: {
        id: String(eventId),
      },
    });
  }, [eventId]);

  return (
    <div className="bg-black">
      <div data-cy="Detail-Page">
        {loading && <div className="flex items-center justify-center w-full h-full">Loading...</div>}
        <DetailTop event={data?.getEventById as Event} />
      </div>
      <div className="flex justify-around py-12 m-auto px-52">
        <div data-cy="Detail-Page">
          {loading && <div className="flex items-center justify-center w-full h-full">Loading...</div>}
          <EventDetail event={data?.getEventById as Event} />
        </div>
        <div data-cy="Detail-Page">
          {loading && <div className="flex items-center justify-center w-full h-full">Loading...</div>}
          <TicketDetail event={data?.getEventById as Event} />
        </div>
      </div>
    </div>
  );
};
export default Page;
