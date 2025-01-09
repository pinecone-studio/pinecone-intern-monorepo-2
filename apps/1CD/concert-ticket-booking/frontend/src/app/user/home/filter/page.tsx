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
import SkeletonCard from '@/components/SkeletonCard';

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
    <div className="bg-zinc-950" data-cy="Filter-Page">
      <div className="xl:w-[1100px] md:w-[700px] w-[350px] mx-auto  py-12 ">
        <div className="flex flex-wrap gap-2 mb-8">
          <div className="relative flex items-center text-white w-[263px]">
            <Input
              data-testid="Artist-Search-Input"
              type="text"
              placeholder="Уран бүтээлчээр хайх"
              className="w-full bg-black border-gray-600 md:w-80"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
            />
            <Search className="absolute w-4 h-4 right-4" />
          </div>
          <DatePicker />
        </div>
        {!loading && data?.getEvents?.length === 0 && (
          <div className="flex flex-col items-center gap-2 m-auto mt-20 col-span-full">
            <div className="w-28 h-28 justify-items-center place-content-center rounded-full bg-[#131313]">
              <HeartCrack className="self-center w-12 h-12 text-white" />
            </div>
            <p className="text-5 text-[#808080] font-light leading-8">Илэрц олдсонгүй</p>
          </div>
        )}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3 ">
          {(loading || data?.getEvents == null) && Array.from({ length: 8 }).map((_, index) => <SkeletonCard key={index} />)}

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
    </div>
  );
};
export default Page;
