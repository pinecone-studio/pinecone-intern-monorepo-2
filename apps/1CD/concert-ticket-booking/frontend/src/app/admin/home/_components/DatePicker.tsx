'use client';
import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Controller, UseFormReturn } from 'react-hook-form';
import { EventInputType } from '@/utils/validation-schema';
import { FormLabel } from '@/components/ui/form';
import { cn } from '@/utils/utils';

type FormProps = {
  form: UseFormReturn<EventInputType>;
};

export const DatePickerWithRange = ({ form }: FormProps) => {
  const {
    formState: { errors },
  } = form;

  return (
    <div>
      <div className="flex flex-col gap-2">
        <FormLabel className={errors.dateRange ? 'text-red-500' : ''} data-testid="form-label-date">
          Тоглолтын өдөр сонгох <span className="text-red-500">*</span>
        </FormLabel>
        <Popover>
          <PopoverTrigger asChild>
            <Button id="date" variant={'outline'} className={cn('w-[300px] justify-start text-left font-normal', !errors.dateRange && 'text-muted-foreground')} data-testid="date-picker-button">
              <CalendarIcon />
              <Controller
                name="dateRange"
                control={form.control}
                render={({ field }) => (
                  <>
                    {field.value?.from ? (
                      field.value.to ? (
                        <>
                          {format(field.value.from, 'LLL dd, y')} - {format(field.value.to, 'LLL dd, y')}
                        </>
                      ) : (
                        format(field.value.from, 'LLL dd, y')
                      )
                    ) : (
                      <span>Өдөр сонгох</span>
                    )}
                  </>
                )}
              />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start" data-testid="popover-content">
            <Controller
              name="dateRange"
              control={form.control}
              render={({ field }) => {
                const dateRange: DateRange = {
                  from: field.value?.from ?? undefined,
                  to: field.value?.to ?? undefined,
                };
                return <Calendar initialFocus mode="range" selected={dateRange} onSelect={field.onChange} numberOfMonths={1} data-testid="date-picker-calendar" />;
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
