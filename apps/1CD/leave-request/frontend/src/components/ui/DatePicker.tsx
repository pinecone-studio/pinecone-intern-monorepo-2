'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

import { cn } from './ComboBox';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { FormikProps } from 'formik';
import { RequestFormValues } from '@/components/createNewRequest/CreateNewRequest';

export const DatePickerDemo = ({ formik }: { formik: FormikProps<RequestFormValues> }) => {
  const { requestDate } = formik.values;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={'outline'} className={cn('w-[280px] justify-between text-left font-normal', !requestDate && 'text-muted-foreground')}>
          {requestDate ? format(requestDate, 'P') : 'Та өдрөө'}
          <CalendarIcon size={16} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          disabled={(date) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return date < today;
          }}
          mode="single"
          selected={requestDate}
          onSelect={(e) => formik.setFieldValue('requestDate', e)}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};
