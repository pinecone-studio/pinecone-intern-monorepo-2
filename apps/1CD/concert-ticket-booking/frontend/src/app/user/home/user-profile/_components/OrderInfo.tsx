/* eslint-disable complexity */

import { Card } from '@/components/ui/card';
import { useGetOrderLazyQuery } from '@/generated';
import dayjs from 'dayjs';
import { Clock } from 'lucide-react';

import DialogComponent from './Dialog';
import toMNT from '@/utils/show-tugrik-format';
import { useAuth } from '@/components/providers';
import { useEffect } from 'react';

const OrderInfo = () => {
  const { refetchOrder } = useAuth();
  const [getOrder, { data, refetch }] = useGetOrderLazyQuery();
  const orders = data?.getOrder;
  useEffect(() => {
    getOrder();
  }, [refetchOrder]);
  return (
    <div className="text-white lg:w-[841px]" data-cy="order-info-container">
      <h1 data-cy="order-info-title" className="mb-6 text-2xl font-semibold">
        Захиалгын мэдээлэл
      </h1>
      {orders?.map((order) => {
        const totalAmount = order?.ticketType.reduce((total, ticket) => {
          const discount = Number(ticket.discount);
          const unitPrice = Number(ticket.unitPrice);
          const soldQuantity = Number(ticket.soldQuantity);
          const discountedPrice = discount > 0 ? (unitPrice * (100 - discount)) / 100 : unitPrice;
          return total + discountedPrice * soldQuantity;
        }, 0);
        return (
          <Card className="bg-[#131313] border-none  px-8 pt-8 pb-6 mb-8" key={order?._id} data-cy={`order-card-${order?._id}`}>
            <div className="mb-4 text-white lg:flex lg:items-center lg:justify-between sm:max-w-flex sm:max-w-flex-col ">
              <div className="lg:gap-1 lg:flex">
                <h2 data-cy={`order-id-${order?._id}`} className="text-base font-normal text-muted-foreground">
                  Захиалгын дугаар :{' '}
                </h2>
                {order?._id}
                <p className="flex items-center gap-2 ml-[14px]">
                  <Clock className="w-4 h-4 " /> {dayjs(order?.createdAt).format('YYYY.MM.DD')}
                </p>
              </div>
              {order?.status === 'pending' && (
                <div data-cy={`order-status-pending-${order?._id}`}>
                  <span className="text-base font-normal text-muted-foreground">Төлөв: </span>
                  <span className="rounded-full bg-black py-2 px-[10px] border-[1px] border-[#27272A] text-xs font-semibold">Цуцлах хүсэлт илгээсэн</span>
                </div>
              )}
              {order?.status === 'approved' && (
                <div data-cy={`order-status-pending-${order?._id}`}>
                  <span className="text-base font-normal text-muted-foreground">Төлөв: </span>
                  <span className="rounded-full bg-black py-2 px-[10px] border-[1px] border-[#27272A] text-xs font-semibold">Хүсэлт баталгаажсан</span>
                </div>
              )}
              {order?.status === 'available' && <DialogComponent orderId={order._id} eventId={order.eventId} totalAmount={totalAmount} refetch={refetch} />}
            </div>
            {order?.ticketType?.map((ticket, index) => {
              const discount = Number(ticket.discount);
              const discountedPrice = Number((Number(ticket.unitPrice) * (100 - discount)) / 100);
              const soldQuantity = Number(ticket.soldQuantity);
              return (
                <div
                  className="py-4 px-6 rounded-[6px] h-[52px] bg-[#131313] border-dashed border-[1px] border-muted-foreground mb-2 flex justify-between items-center"
                  key={index}
                  data-cy={`ticket-card-${index}`}
                >
                  <div>
                    <span className={`${index == 0 ? 'text-[#4651C9]' : index == 1 ? 'text-[#C772C4]' : 'text-white'} flex gap-2 items-center font-bold text-sm`} data-cy={`ticket-zone-${index}}`}>
                      <div className={`${index == 0 ? 'bg-[#4651C9]' : index == 1 ? 'bg-[#C772C4]' : 'bg-white'} h-3 w-3 rounded-full`}></div>
                      {ticket.zoneName}
                    </span>
                  </div>
                  <span className="flex items-center gap-2 text-white" data-cy={`ticket-price-${index}`}>
                    <span className="text-base font-normal text-muted-foreground">
                      {toMNT(discountedPrice)}×{ticket.soldQuantity}
                    </span>
                    <span>{toMNT(discountedPrice * soldQuantity)}</span>
                  </span>
                </div>
              );
            })}
            <div className="flex items-center justify-between px-6 py-4 text-white" data-cy={`order-total-${order?._id}`}>
              <span className="text-sm font-light">Төлсөн дүн</span>
              <span className="text-xl font-bold">{toMNT(Number(totalAmount))}</span>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default OrderInfo;
