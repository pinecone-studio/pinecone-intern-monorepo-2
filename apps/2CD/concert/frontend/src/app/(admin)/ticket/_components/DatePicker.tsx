/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import * as React from 'react';
import { Stack } from '@mui/material';
import { Button } from '@/components/ui/button';
import { DeleteIcon } from 'lucide-react';
import { SelectDay } from './SelectDay';
import { SelectStartTime } from './SelectStartTime';
import { SelectEndHour } from './SelectEndHour';

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
        <SelectDay day={day} setDay={setDay} />
        <Stack direction="row" spacing={2}>
          <SelectStartTime startHour={startHour} getHourNumber={getHourNumber} setEndHour={setEndHour} setStartHour={setStartHour} hourOptions={hourOptions} endHour={endHour} />
          <SelectEndHour endHour={endHour} hourOptions={hourOptions} setEndHour={setEndHour} isEndTimeDisabled={isEndTimeDisabled} />
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
