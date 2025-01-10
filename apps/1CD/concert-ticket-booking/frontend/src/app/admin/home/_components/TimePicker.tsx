'use client';
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EventInputType } from '@/utils/validation-schema';
import { generateHours, generateMinutes } from '@/utils/generate-time';

type FormProps = {
  form: UseFormReturn<EventInputType, any>;
};

const TimePicker = ({ form }: FormProps) => {
  const { errors } = form.formState;

  return (
    <div>
      <FormLabel className={errors.time ? 'text-red-500' : ''} data-testid="time-label">
        Цаг <span className="text-red-500">*</span>
      </FormLabel>
      <div className="flex gap-2" data-testid="time-picker">
        <FormField
          control={form.control}
          name="time.hour"
          render={({ field }) => (
            <FormItem data-testid="hour-field">
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger data-testid="hour-select">
                    <SelectValue placeholder="Цаг" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {generateHours().map((hour) => (
                    <SelectItem key={hour} value={hour} data-testid={`hour-select-item-${hour}`}>
                      {hour}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="time.minute"
          render={({ field }) => (
            <FormItem data-testid="minute-field">
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger data-testid="minute-select">
                    <SelectValue placeholder="Минут" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent data-testid="minute-select-content">
                  {generateMinutes().map((minute) => (
                    <SelectItem key={minute} value={minute} data-testid={`minute-select-item-${minute}`}>
                      {minute}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default TimePicker;
