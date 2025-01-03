'use client';
import { Cards } from '@/components/StarsStaticJson';
import Image from 'next/image';
import CardInformation from '../CardInformation';
import BookingImportantInformation from '@/components/BookingImportantInformation';
import { Button } from '@/components/ui/button';
import { useFormik } from 'formik';
import * as yup from 'yup';
import BookingInformationInput from '../BookingInformationInput';
import { BookingStatus, useAddNewBookingMutation, useGetBookingQuery } from '@/generated';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { BookingPageRightSide } from '@/components/BookingPageRightSide';
import { useRouter } from 'next/navigation';

const Page = ({ params }: { params: { id: string } }) => {
  const [addBooking, { loading: mutationLoading }] = useAddNewBookingMutation();
  const { data, loading } = useGetBookingQuery({
    variables: {
      id: params.id,
    },
  });
  const router = useRouter();
  const validationSchema = yup.object({
    cardNumber: yup.string().required('card information is all required'),
    cardName: yup.string().required('card information is all required'),
    ExpirationDate: yup.string().min(4, 'expiration year and month are required').required('card information is all required'),
    securityCode: yup.string().required('card information is all required'),
    country: yup.string().required('card information is all required'),
    firstName: yup.string().required('firstName is required'),
    email: yup.string().email("it's only email").required('email is required'),
    phoneNumber: yup.string().required('phone number is required'),
  });

  const initialValues = {
    email: '',
    phoneNumber: '',
    cardNumber: '',
    cardName: '',
    ExpirationDate: '',
    securityCode: '',
    country: '',
    firstName: '',
    middleName: '',
    lastName: '',
  };
  const formik = useFormik({
    initialValues,
    onSubmit: async (values, { resetForm }) => {
      await addBooking({
        variables: {
          input: {
            totalPrice: 50000,
            lastName: values.lastName,
            firstName: values.firstName,
            email: values.email,
            phoneNumber: String(values.phoneNumber),
            userId: '6746fe2b288837dc694368dc',
            roomId: '67734f9cc1bc07a554f731a0',
            hotelId: '67734d4aa494d000fe224b6d',
            checkInDate: '2024-12-12',
            checkOutDate: '2024-12-15',
            status: BookingStatus.Booked,
          },
        },
      });
      resetForm();

      toast('booking is succussfully', {
        style: {
          color: 'green',
          borderColor: 'green',
        },
      });
      router.push(`/booking-confirm/${params.id}`);
    },

    validationSchema,
  });
  if (loading) return <div>loading...</div>;
  return (
    <form data-cy="Checkout-Home-Page" onSubmit={formik.handleSubmit} className="max-w-[1280px] w-full mx-auto py-8 px-[60px] flex gap-16">
      <div className="max-w-[581px] w-full">
        <BookingInformationInput errors={formik.errors} touched={formik.touched} values={formik.values} formikHandleChange={formik.handleChange} />
        <div className="flex flex-col gap-4 text-[#09090B] mt-[40px]">
          <div className="flex items-start justify-between">
            <div>
              <div className="mb-2">3. Reservation card detail</div>
              <div className="text-[#71717A] text-sm">Safe, secure transactions. Your personal information is protectd</div>
            </div>
            <div className="flex items-center">
              {Cards.map((card) => (
                <Image className="w-[30px] h-4" key={card} src={card} alt="a" width={1000} height={1000} />
              ))}
            </div>
          </div>
          <CardInformation errors={formik.errors} touched={formik.touched} setFieldValue={formik.setFieldValue} values={formik.values} formikHandleChange={formik.handleChange} />
        </div>
        <div className="h-[1px] w-full bg-[#E4E4E7] my-[40px]"></div>
        <BookingImportantInformation />
        <div className="flex justify-end mt-8">
          <Button data-cy="Complete-Booking-Button" disabled={mutationLoading} type="submit" className="bg-[#2563EB] hover:bg-blue-500 active:bg-blue-300">
            {mutationLoading ? <Loader2 /> : 'Complete Booking'}
          </Button>
        </div>
      </div>
      <Toaster />
      <BookingPageRightSide booking={data?.getBooking} />
    </form>
  );
};
export default Page;
