import { Event } from '@/generated';
import dayjs from 'dayjs';
import { Calendar } from 'lucide-react';
import Image from 'next/image';
const DetailTop = ({ event }: { event: Event }) => {
  return (
    <div className="w-full relative h-[250px]" data-cy="DetailTop-Component">
      {event?.image && <Image src={event.image} alt="" width={1000} height={1000} className="w-full h-[250px] object-cover" />}
      <div className="absolute top-[25%] left-[25%] text-white ">
        <span className="flex gap-3">
          {event?.mainArtists.map((artist) => (
            <span className="rounded-2xl  border-white border-[1px] p-2 gap-2 text-sm w-fit border-opacity-25 mb-3" key={artist.name}>
              {artist?.name}
            </span>
          ))}
        </span>
        {event?.name && <p className="mb-6 text-xl font-bold sm:text-4xl">{event.name}</p>}
        <div className="flex gap-2">
          <Calendar />
          {event?.scheduledDays.map((day) => (
            <span key={day}>{dayjs(day).format('MM.DD')}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DetailTop;
