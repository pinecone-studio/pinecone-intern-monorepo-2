'use client';
import { Cards } from '@/components/StarsStaticJson';
import Image from 'next/image';
import CardInformation from './CardInformation';
import BookingImportantInformation from '@/components/BookingImportantInformation';
import { Button } from '@/components/ui/button';
import { useFormik } from 'formik';
import * as yup from 'yup';
import BookingInformationInput from './BookingInformationInput';
const Page = () => {
  const validationSchema = yup.object({
    cardNumber: yup.string().required('card information is all required'),
    cardName: yup.string().required('card information is all required'),
    ExpirationDate: yup.object({
      month: yup.string().required('card information is all required'),
      year: yup.string().required('card information is all required'),
    }),
    securityCode: yup.string().required('card information is all required'),
    country: yup.string().required('card information is all required'),
    firstName: yup.string().required('firstName is required'),
    email: yup.string().email("it's only email").required('firstName is required'),
    phoneNumber: yup.string().required('phone number is required'),
  });
  const ExpirationDate = {
    month: '',
    year: '',
  };
  const initialValues = {
    email: '',
    phoneNumber: '',
    cardNumber: '',
    cardName: '',
    month: '',
    year: '',
    securityCode: '',
    country: '',
    firstName: '',
    middleName: '',
    lastName: '',
  };
  const formik = useFormik({
    initialValues,
    onSubmit: () => {
      console.log('');
    },
    validationSchema,
  });
  return (
    <form onSubmit={formik.handleSubmit} className="max-w-[1280px] w-full mx-auto py-8 px-[60px] flex gap-16">
      <div className="max-w-[581px] w-full">
        <BookingInformationInput values={formik.values} formikHandleChange={formik.handleChange} />
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
          <CardInformation setFieldValue={formik.setFieldValue} values={formik.values} formikHandleChange={formik.handleChange} />
        </div>
        <div className="h-[1px] w-full bg-[#E4E4E7] my-[40px]"></div>
        <BookingImportantInformation />
        <div className="flex justify-end mt-8">
          <Button type="submit" className="bg-[#2563EB] hover:bg-blue-500 active:bg-blue-300">
            Complete Booking
          </Button>
        </div>
      </div>
      <div>right side</div>
    </form>
  );
};
export default Page;
