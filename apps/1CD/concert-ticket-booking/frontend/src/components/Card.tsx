import { Card } from '@/components/ui/card';
import { Event } from '@/generated';
import Image from 'next/image';
import { CiCalendar } from 'react-icons/ci';
import { CiLocationOn } from 'react-icons/ci';
import dayjs from 'dayjs';

const CardTicket = ({ event }: { event: Event }) => {
  const discount = event.dayTickets[0].ticketType[1].discount || 0;
  const unitPrice = event.dayTickets[0].ticketType[1].unitPrice;
  const discountPrice = (unitPrice * (100 - discount)) / 100;
  return (
    <Card className="max-w-[345px] overflow-hidden relative" data-cy="Card-Component">
      {discount !== 0 && <div className="absolute bg-[#EF4444] rounded-xl text-white px-2 py-1 font-bold top-[48%] left-6"> {event.dayTickets[0].ticketType[1].discount}%</div>}

      <div className="w-full aspect-video overflow-hidden">
        <Image src={event.image} width={500} height={500} alt="" className="object-contain" />
      </div>
      <div className="w-full bg-[#18181B] overflow-hidden p-6 text-[#FAFAFA] flex flex-col justify-between">
        <div>
          <p className="font-normal text-xl">{event.name}</p>
          {event.mainArtists.map((artist, index) => (
            <span className="text-muted-foreground text-[16px] font-light mr-2" key={index}>
              {artist}
            </span>
          ))}
        </div>

        {discount !== 0 ? (
          <div className="flex gap-2 items-end">
            <p className="font-bold text-2xl">{discountPrice}₮ </p>
            <s className="text-muted-foreground text-[16px] font-light">{unitPrice}₮</s>
          </div>
        ) : (
          <div className="flex gap-2 items-end">
            <p className="font-bold text-2xl">{unitPrice}₮</p>
          </div>
        )}

        <div className="flex justify-between text-muted-foreground">
          <div className="items-center gap-1 ">
            {event.scheduledDays.map((day, index) => (
              <span className="flex items-center" key={index}>
                <CiCalendar className="w-4" />
                {dayjs(day).format('MM.DD')}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-1">
            <CiLocationOn className="w-4" />
            {event.venue.name}
          </div>
        </div>
      </div>
    </Card>
  );
};
export default CardTicket;
