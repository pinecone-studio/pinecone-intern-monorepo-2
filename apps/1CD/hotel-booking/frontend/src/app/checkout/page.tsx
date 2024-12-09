'use client';
import { Cards } from '@/components/StarsStaticJson';
import Image from 'next/image';
import CardInformation from './CardInformation';
import BookingImportantInformation from '@/components/BookingImportantInformation';
import { Button } from '@/components/ui/button';
import { useFormik } from 'formik';
import * as yup from 'yup';
import BookingInformationInput from './BookingInformationInput';
import { PaymentStatus, useAddPaymentMutation } from '@/generated';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { BookingPageRightSide } from '@/components/BookingPageRightSide';

const Page = () => {
  const [addPayment, { loading }] = useAddPaymentMutation();
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
      await addPayment({
        variables: {
          input: {
            amount: 5000,
            bookingId: '1',
            userId: '2',
            paymentMethod: 'card',
            status: PaymentStatus.Pending,
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
    },

    validationSchema,
  });
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
          <Button data-cy="Complete-Booking-Button" disabled={loading} type="submit" className="bg-[#2563EB] hover:bg-blue-500 active:bg-blue-300">
            {loading ? <Loader2 /> : 'Complete Booking'}
          </Button>
        </div>
      </div>
      <Toaster />
      <BookingPageRightSide />
    </form>
  );
};
export default Page;
