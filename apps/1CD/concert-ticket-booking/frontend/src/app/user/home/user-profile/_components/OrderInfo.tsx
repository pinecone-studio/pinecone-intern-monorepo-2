import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Order, useGetOrderQuery } from '@/generated';
import dayjs from 'dayjs';
import { Clock, Dot } from 'lucide-react';
import { useState } from 'react';
import DialogComponent from './Dialog';
import { isLessThan24Hours } from '@/utils/to-check';
import { calculateTotalAmount } from '@/utils/calculate';

const OrderInfo = () => {
  const { data } = useGetOrderQuery();
  const orders = data?.getOrder;
  const [open, setOpen] = useState(false);
  console.log('data', data);

  const onClose = () => {
    setOpen(false);
  };

  return (
    <div className="text-white w-[841px]" data-cy="order-info-container">
      <h1 data-cy="order-info-title">Захиалгын мэдээлэл</h1>
      {orders?.map((order) => (
        <Card className="bg-[#131313] border-none px-8 pt-8 pb-6 mb-8" key={order?._id} data-cy={`order-card-${order?._id}`}>
          <div className="text-white flex justify-between items-center mb-2">
            <h2 data-cy={`order-id-${order?._id}`}>
              Захиалгын дугаар : {order?._id}
              <p className="flex items-center gap-2">
                <Clock className="h-4 w-4 " /> {dayjs(order?.createdAt).format('YYYY.MM.DD')}
              </p>
            </h2>
            {order?.status === 'pending' && (
              <div data-cy={`order-status-pending-${order?._id}`}>
                Төлөв: <span className="rounded-full bg-black p-2">Цуцлах хүсэлт илгээсэн</span>
              </div>
            )}
            {isLessThan24Hours(order?.createdAt) && order?.status !== 'pending' && (
              <>
                <Button className="bg-[#27272A]" onClick={() => setOpen(true)} data-cy={`cancel-button-${order?._id}`}>
                  Цуцлах
                </Button>
                <DialogComponent open={open} onClose={onClose} order={order as Order} />
              </>
            )}
          </div>
          {order?.ticketType.map((ticket) => (
            <Card className="h-[52px] bg-[#131313] border-dashed border-muted-foreground mb-2 flex justify-between pr-4" key={ticket._id} data-cy={`ticket-card-${ticket._id}`}>
              <span className="text-white flex gap-2 items-center" data-cy={`ticket-zone-${ticket._id}`}>
                <Dot className="h-12 w-12" />
                {ticket.zoneName}
              </span>
              <span className="text-white flex gap-2 items-center" data-cy={`ticket-price-${ticket._id}`}>
                <span>
                  {ticket.unitPrice}₮×{ticket.soldQuantity}
                </span>
                {Number(ticket.unitPrice) * Number(ticket.soldQuantity)}₮
              </span>
            </Card>
          ))}
          <div className="text-white flex items-center justify-between" data-cy={`order-total-${order?._id}`}>
            <span>Төлсөн дүн</span>
            {order?.ticketType && <span>{calculateTotalAmount(order?.ticketType)}₮</span>}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default OrderInfo;
