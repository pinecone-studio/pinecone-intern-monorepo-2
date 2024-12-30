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
      <div className="text-gray-500 text-xl text-center mt-10" data-cy="no-data-message">
        No data found
      </div>
    );
  }

  const { eventId, orderId, productId, ticketId } = data.getUnitTicket;
  const ticketType = orderId?.ticketType || [];
  const isTicketAvailable = orderId?.status === 'available';

  return (
    <div className="flex flex-col items-center py-8 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 min-h-screen" data-cy="unit-ticket-page">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-4xl mt-10 border-4 border-gray-200" data-cy="ticket-details-container">
        {isTicketAvailable ? (
          <div className="flex gap-4">
            <img src={eventId.image} alt="eventimg" className="mx-auto mb-4 rounded-xl h-[200px] object-cover" data-cy="event-image" />
            <div className="">
              <div className="flex gap-2 items-center">
                <p className="text-gray-700 text-xl " data-cy="event-name-label">
                  Тоглолтын нэр:
                </p>
                <h1 className="text-4xl font-bold text-gray-800 mb-2" data-cy="event-name">
                  {eventId?.name}
                </h1>
              </div>
              <p className="text-lg text-gray-600" data-cy="event-description">
                {eventId.description}
              </p>

              <div className="flex items-center gap-2">
                <h1>Үндсэн артист:</h1>
                {eventId.mainArtists.map((item, idx) => (
                  <p key={idx} className="font-semibold" data-cy={`main-artist-${idx}`}>
                    {item.name}
                  </p>
                ))}
              </div>

              <div className="">
                <div className="flex items-center gap-2">
                  <h2 className="">Тоглолтын огноо:</h2>
                  <p className="font-semibold" data-cy="event-date">
                    {format(productId.scheduledDay, 'yy.MM.dd hh:mm a')}
                  </p>
                </div>
              </div>
              {ticketType.map(
                (item) =>
                  item._id === ticketId && (
                    <div key={item._id} className="" data-cy="ticket-type-details">
                      <div className="text-gray-700 text-lg">
                        {item.additional && (
                          <p className="font-semibold mb-2">
                            <h1>Тасалбарт дагалдах зүйлс:</h1> <p data-cy="ticket-additional">{item.additional}</p>
                          </p>
                        )}
                        {item.discount && item.discount !== '0' ? (
                          <div className="">
                            <h1>Хөнгөлөлтөд үнэ:</h1> <p data-cy="ticket-discount">{(Number(item.discount) * Number(item.unitPrice)) / 100} ₮</p>
                          </div>
                        ) : (
                          <p className="flex item-center gap-2 ">
                            <h1>Тасалбарын үнэ:</h1>
                            <p className="font-semibold" data-cy="ticket-price">
                              {item.unitPrice}
                              <span>₮</span>
                            </p>
                          </p>
                        )}
                        <p className="flex item-center gap-2">
                          <h1>Тасалбарын төрөл:</h1>
                          <p className="font-semibold" data-cy="ticket-zone-name">
                            {item.zoneName}
                          </p>
                        </p>
                      </div>
                    </div>
                  )
              )}
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-600 text-lg">
            <p data-cy="ticket-unavailable"> Ticket has been cancelled</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UnitTicketPage;
