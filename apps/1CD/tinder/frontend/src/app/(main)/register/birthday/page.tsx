'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import clsx from 'clsx';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useRouter } from 'next/navigation';
import { BirthdaySubmitInput } from '@/generated';

const BIRTHDAY_SUBMIT_MUTATION = `
mutation BirthdaySubmit($input: BirthdaySubmitInput!) {
birthdaySubmit(input: $input) {
email
}
}`;

const Birthday = () => {
  const FormSchema = z.object({
    dob: z.date({
      message: 'A date of birth is required.',
    }),
  });
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const router = useRouter();

  const [BirthdaySubmit]

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    const timestamp = data.dob.getTime();
    console.log('DOB timestamp:', timestamp);

    try {
      console.log('Submitting timestamp to backend', { dob: timestamp });
      router.push('/');
    } catch (error) {
      console.error('Error submitting data', error);
    }
  };

  const handleBack = () => {
    router.push('/');
  };

  return (
    <div className="mx-auto flex justify-center w-full max-w-4xl mt-[200px]" data-cy="birthday-page">
      <div className="flex flex-col items-center w-full gap-6">
        <div className="flex items-center gap-1" data-cy="logo-container">
          <Image src={'/img/logo.svg'} alt="Tinder logo" width={40} height={40} className="w-[24px] h-[28px]" />
          <p className="text-3xl text-gray-600 font-semibold">tinder</p>
        </div>
        <div>
          <p className="text-2xl text-gray-900 font-semibold" data-cy="question-title">
            How old are you?
          </p>
          <p className="text-[#71717A] text-sm" data-cy="question-description">
            Please enter your age to continue
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="dob"
              render={({ field }) => (
                <FormItem className="flex flex-col" data-cy="dob-field">
                  <FormLabel data-cy="dob-label">Date of birth</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant="outline" className={clsx('w-[400px]', 'pl-3', 'text-left', 'font-normal', !field.value && 'text-muted-foreground')} data-cy="dob-picker-button">
                          {field.value ? (
                            format(field.value, 'PPP')
                          ) : (
                            <span className="text-[#71717A]" data-cy="dob-placeholder">
                              Pick a date
                            </span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" data-cy="calendar-icon" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start" data-cy="calendar-popover">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                        initialFocus
                        data-cy="calendar"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription data-cy="dob-description">Your date of birth is used to calculate your age.</FormDescription>
                  <FormMessage data-cy="dob-message" />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <div className="flex justify-between w-[400px]" data-cy="navigation-buttons">
          <button type="button" onClick={handleBack} className="hover:bg-gray-100 border border-1 rounded-full px-4 py-2" data-cy="back-button">
            Back
          </button>
          <button type="submit" className="hover:bg-black bg-[#E11D48] text-white font-light rounded-full px-4 py-2" data-cy="next-button">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Birthday;
