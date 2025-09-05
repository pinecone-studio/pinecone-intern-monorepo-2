'use client';
import { LoadingSvg } from '@/components/signup/_components/assets/LoadingSvg';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useCreateBookingInputMutation } from '@/generated';
import { useOtpContext } from '@/components/providers';
import { toast } from 'sonner';

const mockUserId = '68b017713bb2696705c69369';
const mockHotelId = '689d5d72980117e81dad2925';
const mockRoomId = '68b680fbefcd61d7eacdd6fa';
const mockCheckInDate = '2025-09-10';
const mockCheckOutDate = '2025-09-15';

const formSchema = z.object({
  firstname: z.string().min(2, { message: 'Username must be at least 2 characters.' }),
  lastname: z.string().min(2, { message: 'Username must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter email.' }),
  phoneNumber: z.string().min(8, { message: 'Please enter phone number.' }),
});

export const BookingPayment = () => {
  const { bookingData, setBookingData, setBookingSuccess } = useOtpContext();
  const [createBookingInput, { loading, error }] = useCreateBookingInputMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { firstname: '', lastname: '', email: '', phoneNumber: '' },
  });
  const handleCreateBooking = async (values: z.infer<typeof formSchema>) => {
    const { data } = await createBookingInput({
      variables: {
        input: {
          userId: mockUserId,
          hotelId: mockHotelId,
          roomId: mockRoomId,
          checkInDate: mockCheckInDate,
          checkOutDate: mockCheckOutDate,
          roomCustomer: {
            firstName: values.firstname,
            lastName: values.lastname,
            email: values.email,
            phoneNumber: values.phoneNumber,
          },
          adults: bookingData.adults,
          children: bookingData.children,
        },
      },
    });
    await setBookingSuccess(true);
    return data?.createBooking;
  };
  async function onSubmit(values: z.infer<typeof formSchema>) {
    await handleCreateBooking(values);
    setBookingData((prev) => ({
      ...prev,
      userId: mockUserId,
      hotelId: mockHotelId,
      roomId: mockRoomId,
      checkInDate: mockCheckInDate,
      checkOutDate: mockCheckOutDate,
      roomCustomer: {
        firstName: values.firstname,
        lastName: values.lastname,
        email: values.email,
        phoneNumber: values.phoneNumber,
      },
    }));
    toast.success('Booking created successfully');
  }

  if (error) throw new Error('Create booking error');

  return (
    <Form {...form} data-cy="Booking-Payment-Container">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="w-full flex flex-col gap-10">
          <div className="flex flex-col gap-3">
            <div className="font-semibold">1. Whos checking</div>
            <div className="opacity-50 text-[13px]">
              Please tell us the name of the guest staying at the hotel as it appears on the ID that they’ll present at check-in. If the guest has more than one last name, please enter them all.
            </div>
          </div>
          <div className="flex flex-col gap-5">
            <FormField
              control={form.control}
              name="firstname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[12px] font-medium">First name</FormLabel>
                  <FormControl>
                    <Input data-testid="Inpit-1" data-cy="Input-1" placeholder="Enter firstname" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[12px] font-medium">Last name</FormLabel>
                  <FormControl>
                    <Input data-testid="Inpit-2" data-cy="Input-2" placeholder="Enter lastname" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="border-[1px] w-full"></div>
          <div className="flex flex-col gap-3">
            <div className="font-semibold">2. Contact information</div>
            <div className="flex flex-col gap-1">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[12px] font-medium">Email address</FormLabel>
                    <FormControl>
                      <Input data-testid="Inpit-3" data-cy="Input-3" placeholder="Enter email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="opacity-50 text-[15px]">Your confirmation email goes here</div>
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[12px] font-medium">Contact number</FormLabel>
                    <FormControl>
                      <Input data-testid="Inpit-4" data-cy="Input-4" placeholder="Enter phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="w-full flex justify-end">
            <Button data-cy="Complete-Booking-Btn" data-testid="Complete-Booking-Btn" type="submit" className="bg-[#2563EB] hover:bg-[#2564ebd9]">
              {loading ? <LoadingSvg /> : 'Complete booking'}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};
