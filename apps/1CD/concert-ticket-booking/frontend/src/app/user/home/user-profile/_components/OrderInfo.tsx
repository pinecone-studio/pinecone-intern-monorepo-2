import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Order, useGetOrderQuery } from '@/generated';
import dayjs from 'dayjs';
import { Clock, Dot } from 'lucide-react';
import { useState } from 'react';
import DialogComponent from './Dialog';

const OrderInfo = () => {
  const { data } = useGetOrderQuery();
  const orders = data?.getOrder;
  const [open, setOpen] = useState(false);

  const isLessThan24Hours = (isoString: string) => {
    const date1 = new Date();
    const date2 = new Date(isoString);
    const diffInMs = Math.abs(date1.getTime() - date2.getTime());
    const hours24InMs = 24 * 60 * 60 * 1000;
    return diffInMs < hours24InMs;
  };
  const calculateTotalAmount = (ticketType: { unitPrice: string; soldQuantity: string }[]) => {
    let total = 0;
    for (let i = 0; i < ticketType.length; i++) {
      const a = Number(ticketType[i].unitPrice) * Number(ticketType[i].soldQuantity);
      total = total + a;
    }
    return total;
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <div className="text-white w-[841px]">
      <h1>Захиалгын мэдээлэл </h1>
      {orders?.map((order) => (
        <Card className=" bg-[#131313] border-none px-8 pt-8 pb-6 mb-8" key={order?._id}>
          <div className="text-white flex justify-between items-center mb-2">
            <h2>
              Захиалгын дугаар : {order?._id}
              <p className="flex items-center gap-2">
                <Clock className="h-4 w-4 " /> {dayjs(order?.createdAt).format('YYYY.MM.DD')}
              </p>
            </h2>
            {order?.status == 'pending' && (
              <div>
                Төлөв: <span className="rounded-full bg-black p-2">Цуцлах хүсэлт илгээсэн</span>
              </div>
            )}
            {isLessThan24Hours(order?.createdAt) && order?.status !== 'pending' && (
              <Button className="bg-[#27272A]" onClick={() => setOpen(true)}>
                Цуцлах
              </Button>
            )}
            {order && <DialogComponent open={open} onClose={onClose} order={order as Order} />}
          </div>
          {order?.ticketType.map((ticket) => (
            <Card className="h-[52px] bg-[#131313] border-dashed border-muted-foreground mb-2 flex justify-between pr-4" key={ticket._id}>
              <span className="text-white flex gap-2 items-center">
                <Dot className="h-12 w-12" />
                {ticket.zoneName}
              </span>
              <span className="text-white flex gap-2 items-center">
                <span>
                  {ticket.unitPrice}₮×{ticket.soldQuantity}
                </span>
                {Number(ticket.unitPrice) * Number(ticket.soldQuantity)}₮
              </span>
            </Card>
          ))}
          <div className="text-white flex items-center justify-between">
            <span>Төлсөн дүн</span>
            {order?.ticketType && <span>{calculateTotalAmount(order?.ticketType)}₮</span>}
          </div>
        </Card>
      ))}
    </div>
  );
};
export default OrderInfo;
