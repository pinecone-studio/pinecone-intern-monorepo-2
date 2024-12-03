'use client';

import Image from 'next/image';

import { Toaster } from '@/components/ui/sonner';
// import { toast } from 'sonner';
// import { ApolloError } from '@apollo/client';
import { REGEXP_ONLY_DIGITS_AND_CHARS } from 'input-otp';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useState } from 'react';

const VerifyOtp = () => {
  const [otp, setOtp] = useState('');

  console.log(otp);

  //   const handleError = (error: unknown) => {
  //     if (error instanceof ApolloError) {
  //       const message = error.message;

  //       if (message === 'email already exist') {
  //         toast('❗️ This email is already registered. Please use a different email or log in.');
  //       } else {
  //         toast('❗️ An unexpected error occurred. Please try again.');
  //       }
  //     } else {
  //       toast('❗️ An unexpected error occurred. Please try again.');
  //     }
  //   };
  const email = 'lll';

  return (
    <div data-cy="register-page-container" className="pt-[200px] justify-items-center">
      <div data-cy="register-email-header" className="flex items-center gap-1">
        <Image src="../logo.svg" width={20} height={24} alt="logo" className="w-5 h-6" />
        <div className="text-[#424242] font-bold text-2xl">tinder</div>
      </div>
      <div className="text-[#09090B] font-semibold text-2xl pt-6 ">Confirm email</div>
      <div className="text-[#71717A] text-sm font-normal pt-1 w-[314px] text-center">To continue, enter the secure code we sent to {email}. Check junk mail if it’s not in your inbox.</div>

      <InputOTP onChange={setOtp} maxLength={4} pattern={REGEXP_ONLY_DIGITS_AND_CHARS}>
        <InputOTPGroup className="mt-6">
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
        </InputOTPGroup>
      </InputOTP>
      <Toaster />

      <div className="text-[#09090B] font-medium text-sm mt-6">Send again (15)</div>
    </div>
  );
};
export default VerifyOtp;
