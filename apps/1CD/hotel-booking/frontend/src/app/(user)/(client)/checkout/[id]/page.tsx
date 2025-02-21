'use client';
import { Cards } from '@/components/StarsStaticJson';
import Image from 'next/image';
import CardInformation from '../CardInformation';
import BookingImportantInformation from '@/components/BookingImportantInformation';
import { Button } from '@/components/ui/button';
import { useFormik } from 'formik';
import * as yup from 'yup';
import BookingInformationInput from '../BookingInformationInput';
import { BookingStatus, useAddNewBookingMutation, useGetRoomQuery } from '@/generated';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { BookingPageRightSide } from '@/components/BookingPageRightSide';
import { useRouter } from 'next/navigation';
import CheckLoginUser from '@/components/providers/CheckLoginUser';
import { useAuth } from '@/components/providers';
import { useQueryState } from 'nuqs';

const Page = ({ params }: { params: { id: string } }) => {
  const [dateTo] = useQueryState('dateTo');
  const [dateFrom] = useQueryState('dateFrom');
  const { user } = useAuth();
  const [addBooking, { loading: mutationLoading }] = useAddNewBookingMutation();
  const { data, loading } = useGetRoomQuery({
    variables: { id: params.id },
  });
  const router = useRouter();

  const validationSchema = yup.object({
    cardNumber: yup.string().required('Card information is required'),
    cardName: yup.string().required('Card information is required'),
    ExpirationDate: yup.string().min(4, 'Expiration date is required').required('Card information is required'),
    securityCode: yup.string().required('Card information is required'),
    country: yup.string().required('Country is required'),
    firstName: yup.string().required('First name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    phoneNumber: yup.string().required('Phone number is required'),
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
      const res = await addBooking({
        variables: {
          input: {
            totalPrice: 50000,
            lastName: values.lastName,
            firstName: values.firstName,
            email: values.email,
            phoneNumber: String(values.phoneNumber),
            userId: user?._id,
            roomId: params.id,
            hotelId: data?.getRoom.hotelId?._id,
            checkInDate: dateFrom,
            checkOutDate: dateTo,
            status: BookingStatus.Booked,
          },
        },
      });

      resetForm();

      toast.success('Booking successfully completed', {
        style: { color: 'green', borderColor: 'green' },
      });

      router.push(`/booking-confirm/${res.data?.addNewBooking._id}`);
    },
    validationSchema,
  });

  if (loading) return <div className="flex justify-center mt-16"><Image src={'/loader.svg'} alt="Loading..." width={200} height={200} /></div>;

  return (
    <CheckLoginUser>
      <form onSubmit={formik.handleSubmit} className="max-w-[1280px] w-full mx-auto py-8 px-7 md:px-14 lg:px-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
      <BookingPageRightSide room={data?.getRoom} />
        <div className="w-full">
          <BookingInformationInput errors={formik.errors} touched={formik.touched} values={formik.values} formikHandleChange={formik.handleChange} />
          <div className="mt-8 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="mb-1 font-semibold">3. Reservation Card Details</p>
                <p className="text-sm text-gray-500">Safe, secure transactions. Your personal information is protected.</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {Cards.map((card) => (
                  <Image key={card} src={card} alt="Card" width={30} height={16} className="w-8 h-5" />
                ))}
              </div>
            </div>
            <CardInformation errors={formik.errors} touched={formik.touched} setFieldValue={formik.setFieldValue} values={formik.values} formikHandleChange={formik.handleChange} />
          </div>

          <div className="w-full h-px my-8 bg-gray-300"></div>
          <BookingImportantInformation />
          <div className="flex justify-end mt-6">
            <Button disabled={mutationLoading} type="submit" className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-500 active:bg-blue-400">
              {mutationLoading ? <Loader2 className="animate-spin" /> : 'Complete Booking'}
            </Button>
          </div>
        </div>

        
        <Toaster />
      </form>
    </CheckLoginUser>
  );
};

export default Page;
