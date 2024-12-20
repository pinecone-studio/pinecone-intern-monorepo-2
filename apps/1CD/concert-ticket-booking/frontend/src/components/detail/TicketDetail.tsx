import { Event, Product, TicketType } from '@/generated';
import React, { useEffect } from 'react';
import { Check } from 'lucide-react';
import { Command, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import dayjs from 'dayjs';
import { RiCheckboxBlankCircleFill } from 'react-icons/ri';
import { RxCaretSort } from 'react-icons/rx';

const TicketDetail = ({ event }: { event: Event }) => {
  const [open, setOpen] = React.useState(false);
  const [selectedDay, setSelectedDay] = React.useState<string | null>(null);
  const [selectedProducts, setSelectedProducts] = React.useState<Product[]>([]);
  const products = event?.products;

  useEffect(() => {
    if (Array.isArray(products) && products.length > 0) {
      const firstProduct = products[0];
      const firstDay = dayjs(firstProduct.scheduledDay).format('MM.DD');
      setSelectedDay(firstDay);
      const filteredProducts = products.filter((product) => dayjs(product.scheduledDay).format('MM.DD') === firstDay);
      setSelectedProducts(filteredProducts);
    }
  }, [products]);

  const handleSelectDay = (day: string) => {
    setSelectedDay(day);
    setOpen(false);

    if (Array.isArray(products) && products.length > 0) {
      const filteredProducts = products.filter((product) => dayjs(product.scheduledDay).format('MM.DD') === day);
      setSelectedProducts(filteredProducts);
    }
  };

  return (
    <div className="flex flex-col w-[345px] gap-4">
      <h1 className="mb-4 text-sm font-light text-slate-300">Тоглолт үзэх өдрөө сонгоно уу.</h1>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button className="flex justify-between p-2 transition rounded-md bg-[#1f1f1f] border-[#27272A] border hover:bg-gray-700 items-center w-full">
            <p className="text-sm font-normal text-zinc-50">{selectedDay ? `Сонгосон өдөр: ${selectedDay}` : 'Өдөр сонгох'}</p>
            <RxCaretSort className="w-4 h-4 text-zinc-50" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="bg-[#333]">
          <Command>
            <CommandList>
              <CommandGroup>
                {event?.scheduledDays.map((day, index) => (
                  <CommandItem key={index} onSelect={() => handleSelectDay(dayjs(day).format('MM.DD'))} className="flex items-center p-2 space-x-2 transition-all cursor-pointer hover:bg-blue-100">
                    <span>{dayjs(day).format('MM.DD')}</span>
                    {selectedDay === dayjs(day).format('MM.DD') && <Check className="ml-auto text-green-500" />}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <div>
        {selectedProducts.length > 0 ? (
          <div>
            {selectedProducts.map((product, index) => (
              <div key={index} className="flex flex-col gap-4 mt-4">
                {product.ticketType.map((ticket: TicketType, ticketIndex) => {
                  const totalQuantity = Number(ticket.totalQuantity);
                  const soldQuantity = Number(ticket.soldQuantity);
                  const remainingQuantity = totalQuantity - soldQuantity;
                  const discount = Number(ticket.discount);
                  const unitPrice = Number(ticket.unitPrice);
                  const discountPrice = (unitPrice * (100 - discount)) / 100;
                  const textClass = `flex justify-between items-center text-white border border-dashed text-sm font-semibold border-[#27272a] ${
                    ticketIndex === 0 ? 'text-[#4651C9]' : ticketIndex === 1 ? 'text-[#C772C4]' : 'text-white'
                  }`;
                  return (
                    <button key={ticketIndex} className={textClass}>
                      <div className="flex gap-1">
                        <RiCheckboxBlankCircleFill className="w-3 h-3" />
                        <div className="text-xs font-bold">{ticket.zoneName}</div>
                        <div className="ml-2 text-xs font-semibold">({remainingQuantity})</div>
                      </div>
                      <div>
                        {discount !== 0 ? (
                          <div className="flex flex-col items-end gap-1">
                            <p className="text-base font-bold text-white">{discountPrice}₮ </p>
                            <s className="text-xs font-light text-muted-foreground">{unitPrice}₮</s>
                          </div>
                        ) : (
                          <p className="text-base font-bold text-white">{unitPrice}₮</p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-white">Энэ өдрийн тасалбарууд байхгүй байна.</div>
        )}
      </div>
    </div>
  );
};

export default TicketDetail;
