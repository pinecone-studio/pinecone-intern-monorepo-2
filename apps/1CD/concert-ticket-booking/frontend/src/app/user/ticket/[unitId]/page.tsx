'use client';

import { useGetUnitTicketLazyQuery } from '@/generated';
import { useParams } from 'next/navigation';
import React, { useEffect } from 'react';
import { format } from 'date-fns';

const UnitTicketPage = () => {
  const [getUnitTicket, { data }] = useGetUnitTicketLazyQuery();
  const params = useParams();
  const { unitId } = params;

  useEffect(() => {
    getUnitTicket({
      variables: {
        unitId: String(unitId),
      },
    });
  }, [unitId, getUnitTicket]);

  if (!data || !data.getUnitTicket) {
    return (
      <div className="mt-10 text-xl text-center text-gray-500" data-cy="no-data-message">
        No data found
      </div>
    );
  }

  const { eventId, orderId, productId, ticketId } = data.getUnitTicket;
  const ticketType = orderId?.ticketType || [];
  const isTicketAvailable = orderId?.status === 'available';

  return (
    <div
      className="flex flex-col items-center min-h-screen py-8"
      data-cy="unit-ticket-page"
      style={{
        background: 'radial-gradient(42.61% 42.62% at 50% 125%, #00B7F4 0%, #0D0D0F 100%)',
      }}
    >
      <div className="mt-10 border-4 border-[#131313] rounded-lg shadow-xl max-w-[310px] min-h-fit bg-[#131313] shadow-[#00B7F4]" data-cy="ticket-details-container">
        {isTicketAvailable ? (
          <div className="flex flex-col gap-3 p-5">
            <img src={eventId.image} alt="eventimg" className="rounded-xl h-[200px] object-cover w-[280px]" data-cy="event-image" />
            <div className="w-full">
              <div className="flex flex-col items-start border-b border-dashed border-[#706e6e]">
                <p className="pl-2 text-[10px] text-[#00B7F4] font-bold" data-cy="event-name-label">
                  SOUND OF:
                </p>
                <h1 className="w-full mb-2 text-4xl font-bold text-center text-white font-family:Inter" data-cy="event-name">
                  {eventId?.name}
                </h1>
              </div>
              <p className="pt-2 pl-2 text-lg  text-[#a8a8a8]" data-cy="event-description">
                {eventId.description}
              </p>

              <div className="flex items-center gap-3 text-white border-b border-dashed border-[#706e6e] pl-2 pb-2 ">
                {eventId.mainArtists.map((item, idx) => (
                  <p key={idx} className="w-full font-semibold text-center" data-cy={`main-artist-${idx}`}>
                    {item.name}
                  </p>
                ))}
              </div>

              <div className="">
                <div className="flex items-center gap-2 border-b border-dashed border-[#706e6e]">
                  <p className="p-2 text-lg font-semibold text-white" data-cy="event-date">
                    {format(productId.scheduledDay, 'yy.MM.dd hh:mm a')}
                  </p>
                </div>
              </div>
              {ticketType.map(
                (item) =>
                  item._id === ticketId && (
                    <div key={item._id} className="flex flex-col gap-3" data-cy="ticket-type-details">
                      <div className=" flex flex-col gap-2 text-lg text-white border-b border-dashed border-[#706e6e]">
                        {item.additional && (
                          <p className="pl-2">
                            <h1 className="text-[#a8a8a8]">Тасалбарт дагалдах зүйлс:</h1>{' '}
                            <p className="font-semibold" data-cy="ticket-additional">
                              {item.additional}
                            </p>
                          </p>
                        )}
                        {item.discount && item.discount !== '0' ? (
                          <div className="border-b border-dashed border-[#706e6e] pl-2">
                            <h1 className="text-[#a8a8a8]">Discount price only for you:</h1> <p data-cy="ticket-discount">{(Number(item.unitPrice) * (100 - Number(item.discount))) / 100} ₮</p>
                          </div>
                        ) : (
                          <p className="flex gap-2 pl-2 item-center border-b border-dashed border-[#706e6e]">
                            <p className="font-semibold " data-cy="ticket-price">
                              {item.unitPrice}
                              <span>₮</span>
                            </p>
                          </p>
                        )}
                        <p className="flex gap-2 pb-2 pl-2 item-center">
                          <p className="font-semibold" data-cy="ticket-zone-name">
                            {item.zoneName}
                          </p>
                        </p>
                      </div>
                      <p className="w-full text-center text-[#00B7F4] font-bold text-md ">ENJOY THE SHOW!</p>
                    </div>
                  )
              )}
            </div>
          </div>
        ) : (
          <div className="p-4 text-lg text-center text-white">
            <p data-cy="ticket-unavailable"> Ticket has been cancelled</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UnitTicketPage;
