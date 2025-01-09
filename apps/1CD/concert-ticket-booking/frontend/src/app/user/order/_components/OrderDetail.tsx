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
import { Asterisk } from 'lucide-react';

type OrderDetailProp = {
  setState: Dispatch<SetStateAction<number>>;
  setOrder: Dispatch<SetStateAction<Order[]>>;
  setQuantity: Dispatch<SetStateAction<number[]>>;
  order: Order[] | null;
  quantity: number[];
  handleQuantityChange: (idx: number, id: string, price: number, name: string, operation: 'add' | 'sub') => void;
};
const OrderDetail = ({ setState, setQuantity, quantity, order, handleQuantityChange }: OrderDetailProp) => {
  const [getTicket, { data, error, loading }] = useGetTicketWithVenueLazyQuery();
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
    <div className="w-full gap-10 lg:flex lg:items-center lg:justify-center sm:max-w-flex sm:max-w-flex-col" data-cy="order-detail">
      {loading ? (
         <div className="flex items-center justify-center w-full min-h-screen">
         <div className="text-xl font-semibold text-white">Loading...</div>
       </div>
      ):(
        <>
         <div data-cy="venue-image">{venue?.image ? <Image src={venue.image} alt="Venue Image" width={500} height={300} /> : <div>No image available</div>}</div>
      <div className="w-[400px] h-[528px] bg-[#131313] rounded-md flex flex-col justify-center items-center gap-3">
        <div data-cy="event-scheduled-time" className='w-[300px]'>
          <p className="w-full bg-[#131313] pl-1 text-white">Сонгосон өдөр:  {dayjs(ticket?.scheduledDay).format('YY.MM.DD hh:mm a')}</p>
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
            const textClass = ` flex flex-col justify-between text-sm ${idx === 0 ? 'text-[#4651C9]' : idx === 1 ? 'text-[#C772C4]' : 'text-white'}`;
            return (
              <div key={type._id} data-cy={`ticket-type-${idx}`}
              className='w-full border-b border-dashed border-[#1F1F1F]'>
                <div className="w-full rounded-md bg-[#131313] text-white flex items-center py-3 gap-20 justify-between">
                  <div className={textClass}>
                    <span className="flex items-center h-5">
                      <Circle className="w-3 h-3 mr-2" />
                      <div className="text-sm font-bold">{type.zoneName}</div>
                      <div className="ml-2 text-sm font-semibold">({remainingQuantity})</div>
                    </span>
                    <div data-cy={`ticket-price-${idx}`}>
                    {discount !== 0 ? (
                      <div className="flex flex-col">
                        <p className="text-sm text-white" data-cy={`discount-price-${idx}`}>
                          {discountPrice} <span>₮</span>
                        </p>
                        <p className="text-xs font-light text-muted-foreground">
                          {unitPrice} <span>₮</span>
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-white" data-cy={`unit-price-${idx}`}>
                        {unitPrice} <span>₮</span>
                      </p>
                    )}
                  </div>
                    <div className="text-xs font-light text-muted-foreground">{type.additional}</div>
                  </div>
                  <div className="flex items-center">
                    <Button data-cy={`decrease-${idx}`} onClick={() => handleQuantityChange(idx, type._id, price, type.zoneName, 'sub')}
                      className='px-3 py-1 rounded-md hover:bg-slate-100 hover:text-black'>
                      -
                    </Button>
                    <input data-cy={`quantity-input-${idx}`} readOnly type="number" value={quantity[idx] || 0} className="w-[35px] bg-[#131313] text-center pl-3" />
                    <Button data-cy={`increase-${idx}`} disabled={remainingQuantity <= quantity[idx]} onClick={() => handleQuantityChange(idx, type._id, price, type.zoneName, 'add')}
                      className='px-3 py-1 rounded-md hover:bg-slate-100 hover:text-black'>
                      +
                    </Button>
                  </div>
                
                </div>
                {remainingQuantity <= quantity[idx] && <p className="ml-4 text-xs text-red-500">Та {quantity[idx]}-с дээш суудал захиалах боломжгүй байна!</p>}
              </div>
            );
          })}
        </div>
        <div data-cy="order-summary"
        className='w-full text-white text-[14px] flex flex-col pt-2 px-5 gap-5'>
          <div>
            {order &&
              order.map((item, idx) => (
                <div key={idx} className="flex justify-between text-[#A1A1AA] px-5" data-cy={`order-item-${idx}`}>
                  <p className='flex items-center flex-nowrap'>
                    {item.zoneName} <Asterisk size={10}/> {item.buyQuantity}
                  </p>
                  <p>
                    {item.price * item.buyQuantity} <span>₮</span>
                  </p>
                </div>
              ))}
            <div className="mt-4">
              <p className="px-5 text-white" data-cy="total-price">
                Нийт төлөх дүн: {order && order.reduce((total, item) => total + item.price * item.buyQuantity, 0)} <span>₮</span>
              </p>
            </div>
          </div>
          <Button disabled={order?.length === 0} data-cy="purchase-ticket-button" onClick={() => setState(2)}
            className='w-[320px] h-[36px] rounded-md bg-[#00B7F4] text-white hover:bg-white hover:text-[#00B7F4] m-auto'>
            Тасалбар авах
          </Button>
        </div>
      </div></>
      )}
    </div>
  );
};
export default OrderDetail;


