'use client';

import React, { useEffect, useState } from 'react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Button } from '@/components/ui/button';
import { REGEXP_ONLY_DIGITS_AND_CHARS } from 'input-otp';
import { useSignup } from '@/components/providers';
import 'react-toastify/dist/ReactToastify.css';

const SignupVerifyOtp = () => {
  const { verifyOtp, sendOtp } = useSignup();

  const [emailOtp, setEmailOtp] = useState<string>('');

  useEffect(() => {
    const email = localStorage.getItem('userEmail')!;

    setEmailOtp(email);
  }, []);

  const [otpValue, setOtpValue] = useState<string>();

  const [countDown, setCountDown] = useState(15);

  const handleConfirmOtp = async (value: string) => {
    setOtpValue(value);
    if (value.length === 4) {
      await verifyOtp({ otp: value, email: emailOtp });
    }
  };
  const handleResendOtp = async () => {
    await sendOtp({ email: emailOtp });
    setCountDown(15);
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
    <div className="flex items-center justify-center h-screen" data-cy="Verify-Otp-Page">
      <div className="flex flex-col gap-12 text-black">
        <div className="flex flex-col items-center gap-6">
          <div className="text-6xl"></div>
          <div className="flex flex-col items-center gap-2 w-[16rem]">
            <h3 className="text-3xl font-semibold">Confirm email</h3>
            <p className="text-xs text-center text-gray-400">To continue, enter the secure code we sent to {emailOtp}. Check junk mail if it’s not in your inbox.</p>
          </div>
          <InputOTP maxLength={4} value={otpValue} onChange={handleConfirmOtp} pattern={REGEXP_ONLY_DIGITS_AND_CHARS} data-cy="Input-Otp-Value">
            <InputOTPGroup className="bg-white ">
              <InputOTPSlot className="w-14 h-14" index={0} data-cy="Input-Otp-Slot-1" />
              <InputOTPSlot className="w-14 h-14" index={1} data-cy="Input-Otp-Slot-2" />
              <InputOTPSlot className="w-14 h-14" index={2} data-cy="Input-Otp-Slot-3" />
              <InputOTPSlot className="w-14 h-14" index={3} data-cy="Input-Otp-Slot-4" />
            </InputOTPGroup>
          </InputOTP>
        </div>
        <Button variant="link" className="text-gray-500" onClick={handleResendOtp} data-cy="Verify-Otp-Send-Again-Button">
          <div data-cy="Send-Otp-Again-Countdown">Send again ({countDown})</div>
        </Button>
      </div>
    </div>
  );
};

export default SignupVerifyOtp;
