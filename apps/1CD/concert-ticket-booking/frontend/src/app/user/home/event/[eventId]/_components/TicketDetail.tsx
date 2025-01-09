import { Event, Product, TicketType } from '@/generated';
import React, { useEffect } from 'react';
import { Check, ChevronsUpDown, Circle } from 'lucide-react';
import { Command, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import dayjs from 'dayjs';
import Link from 'next/link';
import { useAuth } from '@/components/providers';
import { toast } from 'sonner';

const TicketDetail = ({ event }: { event: Event }) => {
  const [open, setOpen] = React.useState(false);
  const [selectedDay, setSelectedDay] = React.useState<string | null>(null);
  const [selectedProducts, setSelectedProducts] = React.useState<Product[]>([]);
  const products = event?.products;
  const {user}=useAuth();
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
    const filteredProducts = products.filter((product) => dayjs(product.scheduledDay).format('MM.DD') === day);
    setSelectedProducts(filteredProducts);
  };

  return (
    <div className="flex flex-col w-full max-w-[345px] m-auto lg:mx-0 gap-4 px-4 sm:px-6 md:px-0" data-cy="ticket-detail">
      <h1 className="mb-2 text-sm font-light sm:mb-4 sm:text-base text-slate-300">Тоглолт үзэх өдрөө сонгоно уу.</h1>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button data-cy="select-day-button" className="flex justify-between p-2 sm:p-3 transition rounded-md bg-[#1f1f1f] border-[#27272A] border hover:bg-gray-700 items-center w-full">
            <p className="text-sm font-normal sm:text-base text-zinc-50">{selectedDay ? `Сонгосон өдөр: ${selectedDay}` : 'Өдөр сонгох'}</p>
            <ChevronsUpDown className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-50" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="bg-[#333] w-[calc(100vw-2rem)] sm:w-auto max-w-[345px]" data-cy="day-selector">
          <Command>
            <CommandList>
              <CommandGroup>
                {event?.scheduledDays.map((day, index) => (
                  <CommandItem
                    key={index}
                    data-cy="select-day-item"
                    onSelect={() => handleSelectDay(dayjs(day).format('MM.DD'))}
                    className="flex items-center p-2 space-x-2 transition-all cursor-pointer sm:p-3 hover:bg-blue-100"
                  >
                    <span className="text-sm sm:text-base">{dayjs(day).format('MM.DD')}</span>
                    {selectedDay === dayjs(day).format('MM.DD') && <Check className="ml-auto text-green-500" />}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <div className="w-full">
        {selectedProducts.length > 0 ? (
          <div className="grid gap-3 sm:gap-4">
            {selectedProducts.map((product, index) => (
              <div key={index} className="flex flex-col gap-3 sm:gap-4">
                {product.ticketType.map((ticket: TicketType, ticketIndex) => {
                  const totalQuantity = Number(ticket.totalQuantity);
                  const soldQuantity = Number(ticket.soldQuantity);
                  const remainingQuantity = totalQuantity - soldQuantity;
                  const discount = Number(ticket.discount);
                  const unitPrice = Number(ticket.unitPrice);
                  const discountPrice = (unitPrice * (100 - discount)) / 100;
                  const textClass = `${ticketIndex === 0 ? 'text-[#4651C9]' : ticketIndex === 1 ? 'text-[#C772C4]' : 'text-white'}`;

                  return (
                    <button
                      key={ticketIndex}
                      className="flex flex-col px-4 sm:px-6 py-3 sm:py-4 border border-dashed rounded-md text-sm sm:text-base font-semibold border-[#27272a]"
                      data-testid={`ticket-${ticketIndex}`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className={textClass}>
                          <span className="flex items-center h-5 sm:h-6">
                            <Circle className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-2" />
                            <div className="text-sm font-bold sm:text-base">{ticket.zoneName}</div>
                            <div className="ml-2 text-sm font-semibold sm:text-base">({remainingQuantity})</div>
                          </span>
                        </div>
                        <div>
                          {discount !== 0 ? (
                            <div className="flex flex-col items-end gap-0.5 sm:gap-1">
                              <p className="text-sm font-bold text-white sm:text-base" data-cy={`discount-price-${ticketIndex}`}>
                                {discountPrice} <span>₮</span>
                              </p>
                              <s className="text-xs font-light sm:text-sm text-muted-foreground">
                                {unitPrice} <span>₮</span>
                              </s>
                            </div>
                          ) : (
                            <p className="text-sm font-bold text-white sm:text-base" data-cy={`unit-price-${ticketIndex}`}>
                              {unitPrice} <span>₮</span>
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="mt-1 text-xs font-light sm:text-sm text-muted-foreground">{ticket.additional}</div>
                    </button>
                  );
                })}
                {!user ? (
                     <Link href={'/user/sign-in'} className="w-full">
                     <button className="bg-[#00B7F4] w-full h-9 sm:h-10 rounded-md text-sm sm:text-base hover:bg-[#00a3d8] transition-colors"
                     onClick={()=>{ toast.error('Хэрэглэгч нэвтэрнэ үү.')}}
                     >Тасалбар захиалах</button>
                     </Link>
                ):(
                  <Link href={`/user/order/${product._id}?event=${event._id}&venue=${event.venue._id}`} className="w-full">
                  <button className="bg-[#00B7F4] w-full h-9 sm:h-10 rounded-md text-sm sm:text-base hover:bg-[#00a3d8] transition-colors"
                  >Тасалбар захиалах</button>
                  </Link>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-center text-white sm:text-base" data-testid="no-tickets">
            Энэ өдрийн тасалбарууд байхгүй байна.
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketDetail;

