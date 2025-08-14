'use client';
/* eslint-disable no-unused-vars */

import { useState } from 'react';
import { Props } from '@/app/global';
import { Calendar as CalendarIcon } from 'lucide-react';
import { ButtonNextPrevious } from '../ButtonNextPrevious';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export const DateOfBirth = ({ nextPage, previousPage }: Props) => {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);

  return (
    <div className="flex flex-col gap-2 p-6 w-full">
      <div className="text-center space-y-2 mb-8">
        <p className="text-2xl font-semibold">How old are you?</p>
        <p className="text-sm text-[#71717A] font-normal">Please enter your age to continue</p>
      </div>

      <div className="flex flex-col gap-3 w-full ">
        <Label htmlFor="date" className="px-1 text-[16px] font-semibold">
          Date of Birth
        </Label>

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" id="date" className="relative w-full  rounded-2xl border border-[#E5E7EB] bg-white px-4  text-left text-[18px]  justify-between font-normal">
              <span className={date ? 'text-[#0F172A]' : 'text-[#9CA3AF]'}>{date ? date.toLocaleDateString() : 'Pick a date'}</span>
              <CalendarIcon className=" size-5 text-[#9CA3AF]" />
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-auto overflow-hidden p-0 shadow-lg" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(d) => {
                setDate(d);
                setOpen(false);
              }}
              captionLayout="dropdown"
              fromYear={1901}
              toYear={new Date().getFullYear()}
              classNames={
                {
                  // caption: 'flex items-center justify-center gap-3 p-2',
                  // caption_label: 'sr-only',
                  // caption_dropdowns: 'flex items-center gap-2',
                  // dropdown: 'h-9 rounded-md border bg-background px-3 text-sm shadow-sm focus:outline-none',
                  // dropdown_month: 'min-w-[8rem]',
                  // dropdown_year: 'min-w-[6rem]',
                }
              }
            />
          </PopoverContent>
        </Popover>
      </div>

      <p className=" text-[14px] font-normal text-[#71717A]">Your date of birth is used to calculate your age</p>
      <div className="flex w-full items-center justify-between">
        <ButtonNextPrevious previousPage={previousPage} />
        <ButtonNextPrevious nextPage={nextPage} />
      </div>
    </div>
  );
};
