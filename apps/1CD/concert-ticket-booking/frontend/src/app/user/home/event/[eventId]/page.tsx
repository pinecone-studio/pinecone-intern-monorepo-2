'use client';
import DetailTop from '@/components/DetailTop';
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
    <div data-cy="Detail-Page">
      {loading && <div className="flex w-full h-full justify-center items-center">Loading...</div>}
      <DetailTop event={data?.getEventById as Event} />
    </div>
  );
};
export default Page;
