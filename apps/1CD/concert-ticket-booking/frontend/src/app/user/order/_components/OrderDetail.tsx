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
    if (id && !Array.isArray(id) && typeof venueId === 'string') {
      getTicket({
        variables: {
          input: {
            ticketId: id,
            venueId: venueId,
          },
        },
      });
    }
  }, [id, venueId, getTicket]);
  useEffect(() => {
    if (ticket && ticket.ticketType) {
      setQuantity(ticket.ticketType.map(() => 0));
    }
  }, [ticket]);

  const handleInputChange = (idx: number, value: string) => {
    const parsedValue = parseInt(value, 10);
    if (!isNaN(parsedValue) && parsedValue >= 0) {
      setQuantity((prevQuantity) => {
        const newQuantity = [...prevQuantity];
        newQuantity[idx] = parsedValue;
        return newQuantity;
      });
    }
  };
  useEffect(() => {
    if (error) {
      toast.error(`Error: ${error.message || 'Something went wrong!'}`);
    }
  }, [error]);

  return (
    <div className="flex gap-8">
      <div>{venue?.image ? <Image src={venue.image} alt="Venue Image" width={500} height={300} /> : <div>No image available</div>}</div>
      <div>
        <div>
          <p className="text-white">{dayjs(ticket?.scheduledDay).format('YY.MM.DD hh:mm a')}</p>
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
                <div key={type._id}>
                  <div className="flex justify-between w-full">
                    <div className={textClass}>
                      <span className="flex items-center h-5">
                        <Circle className="w-3 h-3 mr-2" />
                        <div className="text-sm font-bold">{type.zoneName}</div>
                        <div className="ml-2 text-sm font-semibold">({remainingQuantity})</div>
                      </span>
                      {remainingQuantity <= quantity[idx] && <p className="text-red-500 text-xs"> Та {quantity[idx]}-с дээш суудал захиалах боломжгүй байна!</p>}
                      <div className="text-xs font-light text-muted-foreground">{type.additional}</div>
                    </div>
                    <div className="flex items-center">
                      <Button onClick={() => handleQuantityChange(idx, type._id, price, type.zoneName, 'sub')}>-</Button>
                      <input readOnly type="number" value={quantity[idx] || 0} onChange={(e) => handleInputChange(idx, e.target.value)} className="mx-2 w-12 text-center" />
                      <Button disabled={remainingQuantity <= quantity[idx]} onClick={() => handleQuantityChange(idx, type._id, price, type.zoneName, 'add')}>
                        +
                      </Button>
                    </div>
                    <div>
                      {discount !== 0 ? (
                        <div className="flex flex-col items-end gap-1">
                          <p className="text-base font-bold text-white" data-cy={`discount-price-${idx}`}>
                            {discountPrice} <span>₮</span>
                          </p>
                          <s className="text-xs font-light text-muted-foreground">
                            {unitPrice} <span>₮</span>
                          </s>
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
        </div>
        <div>
          <div>
            {order &&
              order.map((item, idx) => (
                <div key={idx} className="text-white flex gap-6">
                  <p>
                    {item.zoneName} x {item.buyQuantity}
                  </p>
                  <p>
                    {item.price * item.buyQuantity} <span>₮</span>
                  </p>
                </div>
              ))}
            <div className="mt-4">
              <p className="text-white font-bold">
                Total:
                {order && order.reduce((total, item) => total + item.price * item.buyQuantity, 0)} <span>₮</span>
              </p>
            </div>
          </div>
          <div>
            <Button onClick={() => setState(2)}>Тасалбар авах</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default OrderDetail;
