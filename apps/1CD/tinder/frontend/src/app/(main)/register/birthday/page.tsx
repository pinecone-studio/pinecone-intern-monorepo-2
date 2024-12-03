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
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const Birthday = () => {
  const FormSchema = z.object({
    dob: z.date({
      requiredError: 'A date of birth is required.',
    }),
  });
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const router = useRouter();

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast('Date of birth submitted successfully!');
    console.log(data);
  }

  const handleNext = () => {
    const dob = form.getValues('dob');
    if (!dob) {
      toast.error('Please select a date!');
      return;
    }
    router.push('/');
  };

  const handleBack = () => {
    router.push('/');
  };

  return (
    <div className="mx-auto flex justify-center w-full max-w-4xl mt-[200px]">
      <div className="flex flex-col items-center w-full gap-6">
        <div className="flex items-center gap-1">
          <Image src={'/img/logo.svg'} alt="Tinder logo" width={40} height={40} className="w-[24px] h-[28px]" />

          <p className="text-3xl text-gray-600 font-semibold">tinder</p>
        </div>
        <div>
          <p className="text-2xl text-gray-900 font-semibold">How old are you?</p>
          <p className="text-[#71717A] text-sm">Please enter your age to continue</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="dob"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date of birth</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant="outline" className={clsx('w-[400px]', 'pl-3', 'text-left', 'font-normal', !field.value && 'text-muted-foreground')}>
                          {field.value ? format(field.value, 'PPP') : <span className="text-[#71717A]">Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date() || date < new Date('1900-01-01')} initialFocus />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>Your date of birth is used to calculate your age.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <div className="flex justify-between w-[400px]">
          <button onClick={handleBack} className="hover:bg-gray-100 border border-1 rounded-full px-4 py-2">
            Back
          </button>
          <button type="submit" onClick={handleNext} className="hover:bg-black bg-[#E11D48] text-white font-light rounded-full px-4 py-2">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
export default Birthday;
