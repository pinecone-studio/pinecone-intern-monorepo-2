'use client';
import { useQueryState } from 'nuqs';
import CardTicket from '@/components/Card';
import { Event, useGetEventsLazyQuery } from '@/generated';
import { useEffect } from 'react';
import { useDebounce } from '@uidotdev/usehooks';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { HeartCrack, Search } from 'lucide-react';
import DatePicker from '../DatePicker';

const Page = () => {
  const [q] = useQueryState('q', { defaultValue: '' });
  const [artist, setArtist] = useQueryState('artist', { defaultValue: '' });
  const [date] = useQueryState('date', { defaultValue: '' });

  const debouncedQ = useDebounce(q, 300);

  const [getEvents1, { data, loading }] = useGetEventsLazyQuery();

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
    <div className="w-full min-h-[calc(100vh-310px)] pt-10 bg-black" data-cy="Filter-Page">
      <div className=" py-4  xl:w-[1100px] md:w-[700px] w-[350px] mx-auto grid grid-cols-1 md:grid-cols-2  xl:grid-cols-3 gap-4 ">
        {loading && <div className="flex items-center justify-center w-full h-full">Loading...</div>}

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
        {!loading && data?.getEvents?.length === 0 && (
          <div className="flex flex-col items-center gap-2 m-auto mt-36 col-span-full">
            <div className="w-28 h-28 justify-items-center place-content-center rounded-full bg-[#131313]">
              <HeartCrack className="self-center w-12 h-12 text-white" />
            </div>
            <p className="text-5 text-[#808080] font-light leading-8">Илэрц олдсонгүй</p>
          </div>
        )}
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
