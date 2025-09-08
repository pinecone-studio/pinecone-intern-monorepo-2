'use client';

import * as React from 'react';
import { useState } from 'react';
import { format } from 'date-fns';
import { ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon, Plus, Minus } from 'lucide-react';
import { useOtpContext } from '@/components/providers/UserAuthProvider';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export const DatePicker = () => {
  const { range, setRange, adult, setAdult, childrens, setChildrens } = useOtpContext();
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();

  const handleClickSearch = () => {
    router.push('/search');
  };

  const handleClickTravels = () => {
    setIsOpen((prev) => !prev);
  };

  const handleClickDone = () => {
    setIsOpen(false);
  };

  const handleClickAdult = () => {
    setAdult((prev) => prev + 1);
  };

  const handleClickAdultMinus = () => {
    setAdult((prev) => Math.max(prev - 1, 0));
  };

  const handleClickChildren = () => {
    setChildrens((prev) => prev + 1);
  };

  const handleClickChildrenMinus = () => {
    setChildrens((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div data-testid="date-picker" className="w-[1160px] rounded-lg border-[3px] border-[#FFB700] px-4 py-4 flex gap-x-4">
      <div className="flex flex-col gap-y-2 w-[500px] py-[10px] px-4">
        <p className="text-base font-medium">Dates</p>
        <Popover>
          <PopoverTrigger asChild>
            <div className="flex border py-[10px] px-4 rounded-md items-center gap-x-2">
              <Button variant="ghost" className="bg-white p-0 text-sm font-normal w-full flex justify-start">
                {range?.from ? (
                  range.to ? (
                    <>
                      {format(range.from, 'MMMM dd')} - {format(range.to, 'MMMM dd')}
                    </>
                  ) : (
                    format(range.from, 'MMMM dd')
                  )
                ) : (
                  'Pick a date range'
                )}
              </Button>
              <CalendarIcon className="w-4 h-4" />
            </div>
          </PopoverTrigger>

          <PopoverContent className="w-auto p-0">
            <Calendar mode="range" selected={range} numberOfMonths={2} onSelect={setRange} />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex flex-col gap-y-2 w-[500px]  py-[10px] px-4 relative ">
        <p className="text-base font-medium">Guest</p>
        <div className="flex items-center  border  py-2 px-3 rounded-md">
          <Button data-testid="guest-button" onClick={handleClickTravels} className=" w-full bg-[#F4F4F5] flex  justify-between gap-x-[10px] text-black hover:bg-white">
            {adult} traveller, {childrens} children
            <ChevronDown className="w-4 h-4 text-black" />
          </Button>
        </div>
        {isOpen && (
          <div data-testid="modal-dropdown" className="  px-5 py-5 flex flex-col gap-y-3 border rounded-md bg-white shadow-md p-2 z-10 absolute top-full   w-full  ">
            <p className="text-lg font-semibold">Travels</p>
            <div className="flex gap-x-1 items-center justify-between ">
              <p className="text-sm font-medium">Adult </p>
              <div className="flex items-center justify-center">
                <div data-testid="adult-minus-button" onClick={handleClickAdultMinus} className="w-9 h-9 rounded-lg border flex items-center justify-center cursor-pointer">
                  <Minus onClick={handleClickAdultMinus} className="w-4 h-4" />
                </div>
                <div data-testid="adult-count" className="w-9 h-9  flex items-center  justify-center">
                  {adult}
                </div>
                <div data-testid="adult-plus-button" onClick={handleClickAdult} className="w-9 h-9 rounded-lg border flex items-center justify-center cursor-pointer">
                  <Plus className="w-4 h-4" />
                </div>
              </div>
            </div>
            <div className="flex gap-x-1 items-center justify-between ">
              <p className="text-sm font-medium">Children </p>
              <div className="flex items-center justify-center">
                <div data-testid="children-minus-button" onClick={handleClickChildrenMinus} className="w-9 h-9 rounded-lg border flex items-center justify-center cursor-pointer">
                  <Minus onClick={handleClickChildrenMinus} className="w-4 h-4" />
                </div>
                <div data-testid="children-count" className="w-9 h-9  flex items-center  justify-center">
                  {childrens}
                </div>
                <div data-testid="children-plus-button" onClick={handleClickChildren} className="w-9 h-9 rounded-lg border flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
              </div>
            </div>
            <div className=" border mt-4 mb-4"></div>
            <div className="flex justify-end">
              <Button data-testid="done-button" className="bg-blue-500 text-white  w-[84px] text-sm font-medium" onClick={handleClickDone}>
                Done
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 px-4 flex items-center ">
        <Button data-testid="search-button" className="bg-blue-500 text-white  rounded-md" onClick={handleClickSearch}>
          Search
        </Button>
      </div>
    </div>
  );
};
