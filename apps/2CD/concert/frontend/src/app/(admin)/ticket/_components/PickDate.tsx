/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import * as React from 'react';
import { Stack } from '@mui/material';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { SelectDay } from './SelectDay';
import { SelectStartTime } from './SelectStartHour';
import { SelectEndHour } from './SelectEndHour';

type PickDateProps = {
  setSchedule: (schedule: { startDate: Date; endDate: Date }[]) => void;
  schedule: { startDate: Date; endDate: Date }[];
};
export const PickDate = ({ setSchedule, schedule }: PickDateProps) => {
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
    <Stack data-testid='container'>
      <Stack data-testid='row-stack' direction="row" spacing={2}>
        <SelectDay data-testid='select-day' day={day} setDay={setDay} />
        <Stack data-testid='stack' direction="row" spacing={2}>
          <SelectStartTime data-testid='select-start-time' startHour={startHour} getHourNumber={getHourNumber} setEndHour={setEndHour} setStartHour={setStartHour} hourOptions={hourOptions} endHour={endHour} />
          <SelectEndHour data-testid='select-end-hour' endHour={endHour} hourOptions={hourOptions} setEndHour={setEndHour} isEndTimeDisabled={isEndTimeDisabled} />
          <Button data-testid="add-btn" type="button" onClick={handelAddSchedule}>
            Нэмэх
          </Button>
        </Stack>
      </Stack>
      <div data-testid='schedules' className="flex flex-col">
        {schedule.map((schedule, i) => (
          <div data-testid={`schedule-${schedule.startDate.toString()}`} key={i}>
            <p>
              start : {schedule.startDate.toISOString()} | end:{schedule.endDate.toISOString()}
            </p>
            <X data-testid="delete-icon" onClick={() => handeDeleteDate(schedule)} />
          </div>
        ))}
      </div>
    </Stack>
  );
};
