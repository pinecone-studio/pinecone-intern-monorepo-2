'use client';

import { useState } from 'react';
import { useGetAllOrderQuery } from '@/generated';
import { Button } from '@/components/ui/button';
import { DetailedInfo } from './DetailedInfo';

export const OrderInfo = () => {
  const { data, loading, error } = useGetAllOrderQuery();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading orders</div>;

  const orders = data?.getAllOrder || [];

  const toggleExpand = (index: number) => {
    setExpandedIndex(prev => (prev === index ? null : index));
  };

  const formatTime = (dateStr?: string) =>
    dateStr
      ? new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : '00:00';

  return (
    <div className="">
      {orders.slice(0, 8).map((order, index) => {
        const isExpanded = expandedIndex === index;
        const orderNumber = order.orderNumber?.toLocaleString();
        const tableNumber = order.tableNumber?.toUpperCase() 
        const totalPrice = order.orderPrice?.toLocaleString();
        const formattedTime = formatTime(order.orderDate);

        return (
          <div
            key={index}
            className={`self-stretch w-full mt-4 ${isExpanded ? 'h-auto' : 'h-56'} p-8 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-zinc-200 inline-flex flex-col justify-start items-end gap-4 transition-all duration-300`}
          >
            <div className="self-stretch flex flex-col justify-center items-end gap-6">
              <div className="self-stretch flex flex-col justify-start items-start gap-6">
                <div className="self-stretch inline-flex justify-between items-center">
                  <div className="flex justify-start items-center gap-4">
                    <div className="flex justify-start items-center gap-2">
                      <span className="justify-start text-Background-BackgroundInverseHover text-2xl font-bold font-['GIP'] leading-tight">
                        #{orderNumber}
                      </span>
                      <span className="justify-start text-Text-TextSecondary text-2xl font-normal font-['GIP'] leading-tight">
                        {tableNumber}
                      </span>
                    </div>
                  </div>
                  <div className="w-40 self-stretch flex justify-end items-center gap-1">
                    <div className="w-4 h-4 relative overflow-hidden">
                      <div className="w-3.5 h-3.5 left-[1.33px] top-[1.33px] absolute outline outline-1 outline-offset-[-0.50px] outline-border-border-foreground"></div>
                    </div>
                    <div className="text-right justify-start text-text-text-foreground text-base font-medium font-['GIP'] leading-7">
                      {formattedTime}
                    </div>
                  </div>
                </div>

                <div className="self-stretch h-px border border-border-border-border"></div>

              
                {!isExpanded && (
                  <div className="self-stretch inline-flex justify-between items-end">
                    <div className="font-normal">Нийлбэр дүн:</div>
                    <div className="font-semibold">{totalPrice}₮</div>
                  </div>
                )}
              </div>

              {isExpanded && (
                <>
                  <div className="self-stretch text-sm text-black">
                    <DetailedInfo/>
                  </div>

                
                  <div className="self-stretch flex justify-between items-end border-t pt-4 border-border-border-border">
                    <div className="font-normal">Нийлбэр дүн:</div>
                    <div className="font-semibold">{totalPrice}₮</div>
                  </div>
                </>
              )}

              <div className="self-stretch flex flex-col justify-center items-center gap-4">
                <div className="self-stretch flex flex-col justify-start items-end gap-2">
                  <div className="flex flex-wrap items-center gap-2 md:flex-row">
                    <Button onClick={() => toggleExpand(index)}>
                      {isExpanded ? 'Хадгалах' : 'Дэлгэрэнгүй харах'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
