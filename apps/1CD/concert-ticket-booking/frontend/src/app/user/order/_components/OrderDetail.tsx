/* eslint-disable no-unused-vars */
/* eslint-disable  complexity */
'use client';
import { Button } from '@/components/ui/button';
import { useGetTicketWithVenueLazyQuery } from '@/generated';
import { Order } from '@/utils/type';
import dayjs from 'dayjs';
import { Circle } from 'lucide-react';
import Image from 'next/image';
import { useParams, useSearchParams } from 'next/navigation';
import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { toast } from 'sonner';

type OrderDetailProp = {
  setState: Dispatch<SetStateAction<number>>;
  setOrder: Dispatch<SetStateAction<Order[]>>;
  setQuantity: Dispatch<SetStateAction<number[]>>;
  order: Order[] | null;
  quantity: number[];
  handleQuantityChange: (idx: number, id: string, price: number, name: string, operation: 'add' | 'sub') => void;
};
const OrderDetail = ({ setState, setQuantity, quantity, order, handleQuantityChange }: OrderDetailProp) => {
  const [getTicket, { data, error }] = useGetTicketWithVenueLazyQuery();
  const { id } = useParams();
  const searchParams = useSearchParams();
  const venueId = searchParams.get('venue');

  const venue = data?.getTicketWithVenue.findVenue;
  const ticket = data?.getTicketWithVenue.findTicket;
  useEffect(() => {
    getTicket({
      variables: {
        input: {
          ticketId: id as string,
          venueId: venueId!,
        },
      },
    });
  }, [id, venueId, getTicket]);

  useEffect(() => {
    if (ticket && ticket.ticketType) {
      setQuantity(ticket.ticketType.map(() => 0));
    }
  }, [ticket]);

  useEffect(() => {
    if (error) {
      toast.error(`Error: ${error.message}`);
    }
  }, [error]);
  return (
    <div className="flex gap-8" data-cy="order-detail">
      <div data-cy="venue-image">{venue?.image ? <Image src={venue.image} alt="Venue Image" width={500} height={300} /> : <div>No image available</div>}</div>
      <div>
        <div data-cy="event-scheduled-time">
          <p className="text-white">{dayjs(ticket?.scheduledDay).format('YY.MM.DD hh:mm a')}</p>
        </div>
        <div>
          {ticket?.ticketType.map((type, idx) => {
            const totalQuantity = Number(type.totalQuantity);
            const soldQuantity = Number(type.soldQuantity);
            const remainingQuantity = totalQuantity - soldQuantity;
            const discount = Number(type.discount);
            const unitPrice = Number(type.unitPrice);
            const discountPrice = (unitPrice * (100 - discount)) / 100;
            const price = discount !== 0 ? discountPrice : unitPrice;
            const textClass = `${idx === 0 ? 'text-[#4651C9]' : idx === 1 ? 'text-[#C772C4]' : 'text-white'}`;
            return (
              <div key={type._id} data-cy={`ticket-type-${idx}`}>
                <div className="flex justify-between w-full">
                  <div className={textClass}>
                    <span className="flex items-center h-5">
                      <Circle className="w-3 h-3 mr-2" />
                      <div className="text-sm font-bold">{type.zoneName}</div>
                      <div className="ml-2 text-sm font-semibold">({remainingQuantity})</div>
                    </span>
                    {remainingQuantity <= quantity[idx] && <p className="text-red-500 text-xs">Та {quantity[idx]}-с дээш суудал захиалах боломжгүй байна!</p>}
                    <div className="text-xs font-light text-muted-foreground">{type.additional}</div>
                  </div>
                  <div className="flex items-center">
                    <Button data-cy={`decrease-${idx}`} onClick={() => handleQuantityChange(idx, type._id, price, type.zoneName, 'sub')}>
                      -
                    </Button>
                    <input data-cy={`quantity-input-${idx}`} readOnly type="number" value={quantity[idx] || 0} className="mx-2 w-12 text-center" />
                    <Button data-cy={`increase-${idx}`} disabled={remainingQuantity <= quantity[idx]} onClick={() => handleQuantityChange(idx, type._id, price, type.zoneName, 'add')}>
                      +
                    </Button>
                  </div>
                  <div data-cy={`ticket-price-${idx}`}>
                    {discount !== 0 ? (
                      <div className="flex flex-col items-end gap-1">
                        <p className="text-base font-bold text-white" data-cy={`discount-price-${idx}`}>
                          {discountPrice} <span>₮</span>
                        </p>
                        <p className="text-xs font-light text-muted-foreground">
                          {unitPrice} <span>₮</span>
                        </p>
                      </div>
                    ) : (
                      <p className="text-base font-bold text-white" data-cy={`unit-price-${idx}`}>
                        {unitPrice} <span>₮</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div data-cy="order-summary">
          <div>
            {order &&
              order.map((item, idx) => (
                <div key={idx} className="text-white flex gap-6" data-cy={`order-item-${idx}`}>
                  <p>
                    {item.zoneName} x {item.buyQuantity}
                  </p>
                  <p>
                    {item.price * item.buyQuantity} <span>₮</span>
                  </p>
                </div>
              ))}
            <div className="mt-4">
              <p className="text-white font-bold" data-cy="total-price">
                Total: {order && order.reduce((total, item) => total + item.price * item.buyQuantity, 0)} <span>₮</span>
              </p>
            </div>
          </div>
          <Button disabled={order?.length === 0} data-cy="purchase-ticket-button" onClick={() => setState(2)}>
            Тасалбар авах
          </Button>
        </div>
      </div>
    </div>
  );
};
export default OrderDetail;
