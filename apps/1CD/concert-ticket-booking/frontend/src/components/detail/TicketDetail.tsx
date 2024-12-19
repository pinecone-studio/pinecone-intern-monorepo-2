import { Event, Product } from '@/generated';
import React from 'react';
import { Check } from 'lucide-react';
import { Command, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import dayjs from 'dayjs';
import { RxCaretSort } from 'react-icons/rx';

const TicketDetail = ({ event }: { event: Event }, { products }: { products: Product }) => {
  const [open, setOpen] = React.useState(false);
  const [selectedDay, setSelectedDay] = React.useState<string | null>(null);

  // Өдөр сонгох үйлдэл
  const handleSelectDay = (day: string) => {
    setSelectedDay(day);
    setOpen(false);
  };

  return (
    <div className="flex flex-col max-w-[345px] gap-4">
      <h1 className="mb-4 text-sm font-light text-slate-300">Тоглолт үзэх өдрөө сонгоно уу.</h1>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button className="flex justify-between p-2 transition rounded-md  bg-[#1f1f1f] border-[#27272A] border hover:bg-gray-700 items-center w-full">
            <p className="text-sm font-normal text-zinc-50"> {selectedDay ? `Сонгосон өдөр: ${selectedDay}` : 'Өдөр сонгох'}</p>
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
        {products?.ticketType.map((zone, index) => (
          <span className="text-sm font-semibold text-white" key={index}>
            {zone.zoneName}
          </span>
        ))}
      </div>
    </div>
  );
};

export default TicketDetail;
