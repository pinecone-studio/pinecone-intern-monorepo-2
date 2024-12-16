'use client';
import CardTicket from '@/components/Card';
import { Event, useGetEventsQuery } from '@/generated';

const Page = () => {
  const { data, loading } = useGetEventsQuery();

  return (
    <div className="w-full   bg-black pt-10" data-cy="Home-Page">
      <div className=" py-4  xl:w-[1100px] md:w-[700px] w-[350px] mx-auto grid grid-cols-1 md:grid-cols-2  xl:grid-cols-3 gap-4 ">
        {loading && <div className="flex w-full h-full justify-center items-center">Loading...</div>}
        {data?.getEvents?.map((event) => (
          <div key={event?._id}>{event && <CardTicket event={event as Event} />}</div>
        ))}
      </div>
    </div>
  );
};
export default Page;
