'use client';
import { useQueryState } from 'nuqs';
import CardTicket from '@/components/Card';
import CarouselMain from '@/app/user/home/_components';
import { Event, useGetEventsLazyQuery, useGetSpecialEventQuery } from '@/generated';
import { useEffect } from 'react';
import { useDebounce } from '@uidotdev/usehooks';
import Link from 'next/link';

const Page = () => {
  const [q] = useQueryState('q', { defaultValue: '' });
  const debouncedQ = useDebounce(q, 300);
  const [getEvents1, { data, loading }] = useGetEventsLazyQuery();
  const { data: eventData } = useGetSpecialEventQuery();
  const firstEvent = eventData?.getSpecialEvent;

  useEffect(() => {
    getEvents1({
      variables: {
        filter: {
          q: debouncedQ,
        },
      },
    });
  }, [debouncedQ]);

  return (
    <div className="w-full  bg-black" data-cy="Home-Page">
      {firstEvent && <CarouselMain event={firstEvent} />}
      <div className=" py-4 pt-12 xl:w-[1100px] md:w-[700px] w-[350px] mx-auto grid grid-cols-1 md:grid-cols-2  xl:grid-cols-3 gap-4 ">
        {loading && <div className="flex items-center justify-center w-full h-full">Loading...</div>}
        {data?.getEvents?.map((event) => (
          <div key={event?._id}>
            {event && (
              <Link href={`/user/home/event/${event._id}`}>
                <CardTicket event={event as Event} />
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
export default Page;
