import { Event } from '@/generated';
import Image from 'next/image';
import dayjs from 'dayjs';
import { Calendar, MapPin } from 'lucide-react';

const CardTicket = ({ event }: { event: Event }) => {
  const discount = Number(event.products[0].ticketType[1].discount) || 0; // Default to 0 if discount is falsy
  const unitPrice = Number(event.products[0].ticketType[1].unitPrice);
  const discountPrice = (unitPrice * (100 - discount)) / 100;

  return (
    <div className="max-w-[345px] h-full border rounded overflow-hidden relative border-none" data-cy="Card-Component">
      {discount !== 0 && <div className="absolute bg-[#EF4444] rounded-xl text-white px-2 py-1 font-bold top-[175px] left-6"> {event.products[0].ticketType[1].discount}%</div>}

      <div className="w-full overflow-hidden aspect-video">
        <Image src={event.image} width={500} height={500} alt="" className="object-contain" />
      </div>
      <div className="w-full bg-[#18181B] h-full overflow-hidden p-6 text-[#FAFAFA] flex flex-col gap-2">
        <div>
          <p className="text-xl font-normal">{event.name}</p>
          {event.mainArtists.map((artist, index) => (
            <span className="text-muted-foreground text-[16px] font-light mr-2" key={index}>
              {artist.name}
            </span>
          ))}
        </div>

        {discount !== 0 ? (
          <div className="flex items-end gap-2">
            <p className="text-2xl font-bold">{discountPrice}₮ </p>
            <s className="text-muted-foreground text-[16px] font-light">{unitPrice}₮</s>
          </div>
        ) : (
          <div className="flex items-end gap-2">
            <p className="text-2xl font-bold">{unitPrice}₮</p>
          </div>
        )}

        <div className="flex flex-col justify-between text-muted-foreground">
          <div className="items-center gap-1 ">
            {event.scheduledDays.length > 1 ? (
              <span className="flex items-center gap-1">
                <Calendar className="w-4" />
                {dayjs(event.scheduledDays[0]).format('MM.DD')} - {dayjs(event.scheduledDays[event.scheduledDays.length - 1]).format('MM.DD')}
              </span>
            ) : (
              <span className="flex gap-2">
                {event.scheduledDays.map((day, index) => (
                  <span className="flex items-center gap-1" key={index}>
                    <Calendar className="w-4" />
                    {dayjs(day).format('MM.DD')}
                  </span>
                ))}
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-1 ">
            <MapPin className="w-4" />
            {event.venue.name}
          </div>
        </div>
      </div>
    </div>
  );
};
export default CardTicket;
