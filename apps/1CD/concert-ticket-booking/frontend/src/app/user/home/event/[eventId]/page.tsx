'use client';
import DetailTop from '@/components/DetailTop';
import EventDetail from '@/app/user/home/event/[eventId]/_components/EventDetail';
import TicketDetail from '@/app/user/home/event/[eventId]/_components/TicketDetail';

import { Event, useGetRelatedEventsLazyQuery } from '@/generated';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';

import CardTicket from '@/components/Card';
import Link from 'next/link';

const Page = () => {
  const [getCurrentEvent, { data, loading }] = useGetRelatedEventsLazyQuery();
  const params = useParams();
  const { eventId } = params;

  useEffect(() => {
    getCurrentEvent({
      variables: {
        eventId: String(eventId),
      },
    });
  }, []);

  const relatedEvents = data?.getRelatedEvents?.relatedEvents ?? [];
  return (
    <div className="bg-zinc-950">
      <div>
        <div data-cy="Detail-Page">
          {loading && <div className="flex items-center justify-center w-full h-full">Loading...</div>}
          <DetailTop event={data?.getRelatedEvents?.eventDetail as Event} />
        </div>
        <div className="flex justify-around gap-16 py-12 m-auto px-52 max-w-[1400px]">
          <div data-cy="Event-Detail">
            {loading && <div className="flex items-center justify-center w-full h-full">Loading...</div>}
            <EventDetail event={data?.getRelatedEvents?.eventDetail as Event} />
          </div>
          <div data-cy="Ticket-Detail">
            {loading && <div className="flex items-center justify-center w-full h-full">Loading...</div>}
            <TicketDetail event={data?.getRelatedEvents?.eventDetail as Event} />
          </div>
        </div>
        <div data-cy="Related-Events" className="flex flex-col gap-6 py-16 px-28 max-w-[1334px] m-auto">
          <h1 className="text-xl font-light leading-5 text-white">Холбоотой эвент болон тоглолтууд</h1>
          <div className="py-4 xl:w-[1100px] md:w-[700px] w-[350px] mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 ">
            {relatedEvents.map((event) => (
              <Link href={`/user/home/event/${event._id}`} key={event._id}>
                <CardTicket event={event as Event} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
