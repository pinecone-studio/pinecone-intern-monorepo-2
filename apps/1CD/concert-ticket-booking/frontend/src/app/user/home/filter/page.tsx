'use client';
import { useQueryState } from 'nuqs';
import CardTicket from '@/components/Card';
import { Event, useGetEventsLazyQuery } from '@/generated';
import { useEffect } from 'react';
import { useDebounce } from '@uidotdev/usehooks';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import DatePicker from '../DatePicker';

const Page = () => {
  const [q] = useQueryState('q', { defaultValue: '' });
  const [artist, setArtist] = useQueryState('artist', { defaultValue: '' });
  const [date] = useQueryState('date', { defaultValue: '' });

  const debouncedQ = useDebounce(q, 300);

  const [getEvents1, { data}] = useGetEventsLazyQuery();

  useEffect(() => {
    getEvents1({
      variables: {
        filter: {
          q: debouncedQ,
          artist: artist,
          date: date,
        },
      },
    });
  }, [debouncedQ, artist, date]);

  return (
    <div className="w-full pt-10 bg-black" data-cy="Filter-Page">
      <div className=" py-4  xl:w-[1100px] md:w-[700px] w-[350px] mx-auto grid grid-cols-1 md:grid-cols-2  xl:grid-cols-3 gap-4 ">
       <div className="relative flex items-center w-full px-2 text-white">
          <Input
            data-testid="Artist-Search-Input"
            type="text"
            placeholder="Уран бүтээлчээр хайх"
            className="w-full bg-black border-gray-600 md:w-80"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
          />
          <Search className="absolute w-4 h-4 right-10" />
        </div>
        <div className="w-full px-2">
          <DatePicker />
        </div>
        <div className="hidden xl:block"></div>

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
