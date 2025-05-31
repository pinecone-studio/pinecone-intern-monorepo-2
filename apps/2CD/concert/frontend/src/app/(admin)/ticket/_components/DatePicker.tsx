/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import * as React from 'react';

import { Calendar } from '@/components/ui/calendar';
import { Stack } from '@mui/material';
import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { CalendarIcon, DeleteIcon } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type DatePickerProps = {
  setSchedule: (schedule: { startDate: Date; endDate: Date }[]) => void;
  schedule: { startDate: Date; endDate: Date }[];
};

export const DatePicker = ({ setSchedule, schedule }: DatePickerProps) => {
  const [day, setDay] = React.useState<Date | undefined>(new Date());
  const [startHour, setStartHour] = React.useState<string>('');
  const [endHour, setEndHour] = React.useState<string>('');
  const createDateWithTime = (baseDate: Date, timeString: string) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const newDate = new Date(baseDate);
    newDate.setHours(hours, minutes, 0, 0);
    return newDate;
  };
  const hourOptions = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    return `${hour}:00`;
  });
  const getHourNumber = (timeString: string) => {
    return parseInt(timeString.split(':')[0]);
  };
  const isEndTimeDisabled = (endTime: string) => {
    if (!startHour) return false;
    return getHourNumber(endTime) <= getHourNumber(startHour);
  };
  const handelAddSchedule = () => {
    if (setSchedule && day && startHour && endHour) {
      const startDate = createDateWithTime(day, startHour);
      const endDate = createDateWithTime(day, endHour);

      setSchedule([
        ...schedule,
        {
          startDate: startDate,
          endDate: endDate,
        },
      ]);
    }
  };
  const handeDeleteDate = (date: { startDate: Date; endDate: Date }) => {
    const newShedule = schedule.filter((s) => {
      return s !== date;
    });
    setSchedule(newShedule);
  };
  return (
    <Stack>
      <Stack direction="row" spacing={2}>
        <FormItem className="flex flex-col">
          <FormLabel>Date of birth</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button variant={'outline'} className="w-[200px] pl-3 text-left font-normal">
                  {day ? format(day, 'PPP') : <span>Pick a date</span>}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={day} onSelect={setDay} disabled={(date) => date < new Date()} initialFocus />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>

        <Stack direction="row" spacing={2}>
          <FormItem className="flex flex-col">
            <FormLabel>эхлэх цаг*</FormLabel>
            <Select
              value={startHour}
              onValueChange={(value) => {
                setStartHour(value);
                // Reset end hour if it becomes invalid
                if (endHour && getHourNumber(endHour) <= getHourNumber(value)) {
                  setEndHour('');
                }
              }}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Эхлэх цаг" />
              </SelectTrigger>
              <SelectContent>
                {hourOptions.map((hour) => (
                  <SelectItem key={hour} value={hour} disabled={isEndTimeDisabled(hour)}>
                    {hour}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormItem>

          <FormItem className="flex flex-col">
            <FormLabel>дуусах цаг*</FormLabel>
            <Select value={endHour} onValueChange={setEndHour}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Дуусах цаг" />
              </SelectTrigger>
              <SelectContent>
                {hourOptions.map((hour) => (
                  <SelectItem key={hour} value={hour} disabled={isEndTimeDisabled(hour)}>
                    {hour}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormItem>
          <Button type="button" onClick={handelAddSchedule}>
            Нэмэх
          </Button>
        </Stack>
      </Stack>
      <div className="flex flex-col">
        {schedule.map((schedule, i) => (
          <div key={i}>
            <p>
              start : {schedule.startDate.toISOString()} | end:{schedule.endDate.toISOString()}
            </p>
            <DeleteIcon onClick={() => handeDeleteDate(schedule)} />
          </div>
        ))}
      </div>
    </Stack>
  );
};
