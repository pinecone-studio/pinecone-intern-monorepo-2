'use client ';
import { Event } from '@/generated';
import dayjs from 'dayjs';
import Image from 'next/image';
import React from 'react';
import { CiCalendar, CiLocationOn } from 'react-icons/ci';
import { IoMdTime } from 'react-icons/io';
const EventDetail = ({ event }: { event: Event }) => {
  return (
    <div className="flex justify-around ">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between max-w-[533px]">
          <div className="flex gap-6">
            <div className="flex items-center gap-2 ">
              <CiCalendar className="w-4 h-4 text-gray-400" />
              {event?.scheduledDays.length > 1 ? (
                <span className="flex items-center text-base text-white">
                  {dayjs(event.scheduledDays[0]).format('YYYY.MM.DD')} - {dayjs(event.scheduledDays[event.scheduledDays.length - 1]).format('MM.DD')}
                </span>
              ) : (
                event?.scheduledDays.map((day, index) => (
                  <span className="flex items-center text-base text-white" key={index}>
                    {dayjs(day).format('YY.MM.DD')}
                  </span>
                ))
              )}
            </div>
            <div className="flex items-center gap-2">
              <IoMdTime className="w-4 h-4 text-gray-400" />
              <span className="text-base text-white">{event?.scheduledDays.length > 0 && <span className="flex items-center">{dayjs(event.scheduledDays[0]).format('hh:mm A')}</span>}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CiLocationOn className="w-4 h-4 text-gray-400" />
            <span className="text-base text-white">{event?.venue.name}</span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div>
            <h1 className="text-sm font-light text-zinc-50">Special Artist:</h1>
            {event?.guestArtists?.map((guest, index) => (
              <span className="text-sm font-semibold text-white" key={index}>
                {guest?.name}
              </span>
            ))}
          </div>
          <div>
            <h1 className="text-sm font-light text-zinc-50">Тоглолтын цагийн хуваарь:</h1>
            <ul>
              <li className="text-sm font-semibold text-white">Door open: 6pm</li>
              <li className="text-sm font-semibold text-white">Music start: 22pm</li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-light text-zinc-50">Тоглолтын дэлгэрэнгүй:</p>
            <span className="text-sm font-semibold text-white"> {event?.description}</span>
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="text-sm font-medium text-zinc-50">Stage plan:</h1>
            <div>
              <Image src="/images/stagePlan.png" alt="Stage" width={533} height={413} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
