'use client';

import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Button } from '@/components/ui/button';
import { Loader } from 'lucide-react';
import { toast } from 'sonner';
import { useVerifyOtpMutation } from '@/generated';
import { useRouter } from 'next/navigation';

type VerifyEmailParams = {
  variables: {
    email: string;
  };
};
type VerifyOtp = {
  email: string;
  setState: Dispatch<SetStateAction<number>>;
  verifyUserEmail: (_params: VerifyEmailParams) => void;
};

const VerifyOtp = ({ email, setState, verifyUserEmail }: VerifyOtp) => {
  const router = useRouter();
  const [countDown, setCountDown] = useState(90);
  const [verifyOtp, { loading }] = useVerifyOtpMutation({
    onCompleted: () => {
      toast.success('We’ve sent you a link to recover your password. Check your inbox!');
      router.push('/user/sign-in');
    },
    onError: () => {
      toast.error('Oops! The OTP is incorrect or has expired. Please try again.');
      setState(1);
    },
  });

  const handleChange = (otp: string) => {
    if (otp.length === 4 && email) {
      verifyOtp({ variables: { input: { email, otp } } });
    }
  };

  const handleResendOtp = () => {
    setCountDown(60);
    verifyUserEmail({ variables: { email } });
  };
  useEffect(() => {
    if (countDown > 0) {
      const countdown = setInterval(() => {
        setCountDown((prevSeconds) => prevSeconds - 1);
      }, 1000);
      return () => clearInterval(countdown);
    }
  }, [countDown]);

  return (
    <div
      className="flex min-h-[calc(100vh-1px)] bg-black align-center px-4 py-6"
      style={{
        background: 'radial-gradient(32.61% 32.62% at 50% 125%, #00B7F4 0%, #0D0D0F 100%)',
      }}
      data-cy="verify-otp-page"
    >
      <div className="w-full max-w-[446px] rounded-2xl bg-[#09090B] m-auto flex flex-col border border-gray-600 py-6 px-6 sm:py-8 sm:px-12 gap-6" data-cy="verify-otp-container">
        <>
          <h1 className="mt-4 text-xl font-semibold text-center text-white sm:mt-8 sm:text-2xl" data-cy="verify-otp-title">
            Баталгаажуулах
          </h1>
          <p className="text-xs text-white text-center" data-cy="verify-otp-description">
            Таны {email} хаягт илгээсэн баталгаажуулах 4 оронтой кодыг оруулна уу
          </p>
          <div className="flex justify-center" data-cy="otp-input-container">
            <InputOTP maxLength={4} onChange={handleChange} data-cy="otp-input">
              <InputOTPGroup className="text-white">
                <InputOTPSlot index={0} data-cy="otp-input-0" />
                <InputOTPSlot index={1} data-cy="otp-input-1" />
                <InputOTPSlot index={2} data-cy="otp-input-2" />
                <InputOTPSlot index={3} data-cy="otp-input-3" />
              </InputOTPGroup>
            </InputOTP>
          </div>
          {loading ? (
            <Loader data-cy="otp-loader" />
          ) : (
            <Button className="cursor-pointer text-muted-foreground mt-12 underline text-sm font-medium" onClick={handleResendOtp} variant="link" data-cy="resend-otp-button">
              Дахин илгээх ({countDown})
            </Button>
          )}
        </>
      </div>
    </div>
  );
};

export default VerifyOtp;
