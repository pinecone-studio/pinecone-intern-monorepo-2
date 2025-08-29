'use client';

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

function formatDate(date: Date | undefined) {
  if (!date) return "";
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function isValidDate(date: Date | undefined) {
  if (!date) return false;
  return !isNaN(date.getTime());
}

const DateAndBirth = ({ nextStep, prevStep }: { nextStep: () => void; prevStep: () => void }) => {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(new Date("2025-06-01"));
  const [month, setMonth] = React.useState<Date | undefined>(date);
  const [value, setValue] = React.useState(formatDate(date));

  return (
    <div className="flex justify-center items-center h-screen">
      <div className=" w-1/3 h-screen flex flex-col items-center">
        <h1 className="text-3xl font-bold m-10">🔥 tinder</h1>
        <h1 className="text-3xl font-semibold">How old are you?</h1>
        <p className="text-gray-500 text-sm">
          Please enter your age to continue.
        </p>

        <div className="m-10">
          <div className="flex flex-col gap-3">
            <Label htmlFor="date" className="px-1">
              Date of Birth
            </Label>
            <div className="relative flex gap-2">
              <Input
                id="date"
                value={value}
                placeholder="June 01, 2025"
                className="bg-background pr-10 w-[450px]"
                onChange={(e) => {
                  const date = new Date(e.target.value);
                  setValue(e.target.value);
                  if (isValidDate(date)) {
                    setDate(date);
                    setMonth(date);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setOpen(true);
                  }
                }}
              />

              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    id="date-picker"
                    variant="ghost"
                    className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
                  >
                    <CalendarIcon className="size-3.5" />
                    <span className="sr-only">Select date</span>
                  </Button>
                </PopoverTrigger>

                <PopoverContent
                  className="w-auto overflow-hidden p-0"
                  align="end"
                  alignOffset={-8}
                  sideOffset={10}
                >
                  <Calendar
                    mode="single"
                    selected={date}
                    captionLayout="dropdown"
                    month={month}
                    onMonthChange={setMonth}
                    onSelect={(date) => {
                      setDate(date);
                      setValue(formatDate(date));
                      setOpen(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <p className="text-gray-500 text-sm ">Your date of birth is used to calculate your age.</p>
          </div>
        </div>

        <div className="flex justify-around w-full">
          <Button
            variant="outline"
            className="border rounded-full text-white bg-red-500 "
            onClick={prevStep}
          >
            Back
          </Button>
          <Button
            variant="outline"
            onClick={nextStep}
            className="border rounded-full text-white bg-red-500 "
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DateAndBirth;
