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
    <div className="min-h-screen bg-zinc-950">
      {loading ? (
        <div className="flex items-center justify-center w-full min-h-screen">
          <div className="text-xl font-semibold text-white">Loading...</div>
        </div>
      ) : (
        <>
          <div data-cy="Detail-Page">
            <DetailTop event={data?.getRelatedEvents?.eventDetail as Event} />
          </div>
          <div className="py-8 m-auto lg:flex lg:justify-center max-w-7xl md:py-12 sm:px-6 lg:px-8">
            <div className="lg:flex lg:gap-20 md:flex-row sm:max-w-flex sm:max-w-flex-col">
              <div data-cy="Event-Detail" className="w-full md:w-3/5">
                <EventDetail event={data?.getRelatedEvents?.eventDetail as Event} />
              </div>
              <div data-cy="Ticket-Detail" className="w-full md:w-2/5">
                <TicketDetail event={data?.getRelatedEvents?.eventDetail as Event} />
              </div>
            </div>
          </div>
          <div data-cy="Related-Events" className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <h1 className="mb-6 text-xl font-light text-white md:text-2xl">Холбоотой эвент болон тоглолтууд</h1>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedEvents.map((event) => (
                <Link href={`/user/home/event/${event._id}`} key={event._id} className="transition-transform hover:scale-105">
                  <CardTicket event={event as Event} />
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Page;
