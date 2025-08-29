'use client';
import { LoadingSvg } from '@/components/signup/_components/assets/LoadingSvg';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCreateBookingMutation, useUpdateUserMutationMutation } from '@/generated';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { useState } from 'react';
import { useOtpContext } from '@/components/providers';
import { BookingSuccess } from './BookingSuccess';
const mockUserId = '68b017713bb2696705c69369';
const mockHotelId = '689d5d72980117e81dad2925';
const mockRoomId = '68b0f2b7c3c8ff1e6241a4d3';
const mockEmailAddress = 'bati202009@gmail.com';
const mockCheInDate = '2025-08-30';
const mockCheOutDate = '2025-08-31';

const formSchema = z.object({
  firstname: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
  lastname: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
});

export const BookingPayment = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      lastname: '',
      firstname: '',
    },
  });
  const { setBookingSuccess } = useOtpContext();
  const [createBooking, { loading }] = useCreateBookingMutation();
  const [updateUser] = useUpdateUserMutationMutation();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      createBooking({
        variables: {
          input: {
            userId: mockUserId,
            hotelId: mockHotelId,
            roomId: mockRoomId,
            checkInDate: mockCheInDate,
            checkOutDate: mockCheOutDate,
          },
        },
      });

      updateUser({
        variables: {
          input: {
            _id: mockUserId,
            email: mockEmailAddress,
            lastName: values.lastname,
            firstName: values.firstname,
          },
        },
      });
      setBookingSuccess(true);
      await toast.success('Booking success');
    } catch (error) {
      toast.error('Booking error');
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="w-full flex flex-col gap-10">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-3">
              <div className="font-semibold">1. Who's checking</div>
              <div className="opacity-50 text-[13px]">
                Please tell us the name of the guest staying at the hotel as it appears on the ID that they’ll present at check-in. If the guest has more than one last name, please enter them all.
              </div>
            </div>
            <div className="flex flex-col gap-5">
              <div>
                <FormField
                  control={form.control}
                  name="firstname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[12px] font-medium">First name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter firstname" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <FormField
                  control={form.control}
                  name="lastname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[12px] font-medium">Last name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter lastname" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          <div className="border-[1px] w-full"></div>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-3">
              <div className="font-semibold">2. Contact information</div>
            </div>

            <div>
              <div className="text-[12px] font-medium">Email address</div>
              <Input disabled type="mail" defaultValue={mockEmailAddress} />
            </div>
          </div>

          <div className="w-full flex justify-end">
            <Button type="submit" className="bg-[#2563EB] hover:bg-[#2564ebd9]">
              {loading ? <LoadingSvg /> : 'Complete booking'}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};
