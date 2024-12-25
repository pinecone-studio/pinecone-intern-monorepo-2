'use client';
import DetailTop from '@/components/DetailTop';
import EventDetail from '@/app/user/home/event/[eventId]/_components/EventDetail';
import TicketDetail from '@/app/user/home/event/[eventId]/_components/TicketDetail';

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
      <div className="flex justify-around py-12 m-auto px-52 max-w-[1400px]">
        <div data-cy="Event-Detail">
          {loading && <div className="flex items-center justify-center w-full h-full">Loading...</div>}
          <EventDetail event={data?.getEventById as Event} />
        </div>
        <div data-cy="Ticket-Detail">
          {loading && <div className="flex items-center justify-center w-full h-full">Loading...</div>}
          <TicketDetail event={data?.getEventById as Event} />
        </div>
      </div>
    </div>
  );
};
export default Page;
