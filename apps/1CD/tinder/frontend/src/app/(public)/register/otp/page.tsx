'use client';

import Image from 'next/image';
import { REGEXP_ONLY_DIGITS_AND_CHARS } from 'input-otp';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { useResendOtpMutation, useVerifyOtpMutation } from '@/generated';

import { useEffect, useState } from 'react';



const COUNTDOWN_DURATION = 15; 

const VerifyOtp = () => {
  const [countdown, setCountdown] = useState(0);
  const [canResend, setCanResend] = useState(true);
  const [email, setEmail] = useState('');


  useEffect(() => {
    const storedEmail = localStorage.getItem('userEmail');
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      setCanResend(false);
      const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const [verifyOtp] = useVerifyOtpMutation({

    onCompleted: async(data) => {
      const token=data.verifyOtp.token
      await fetch(`/token?token=${token}`);
      window.location.href = '/register/password';
    },

    onError: () => {
      toast.error('Failed to verify OTP. Please try again later.');
    },
  });

  const [resendOtp] = useResendOtpMutation({

    variables: {
      input: {
        email,

      },
    },
    onCompleted: () => {
        toast.success('New OTP sent to your email. Please check your email!');
    },
  });

  const handleResend = () => {
    if (canResend) {
      setCountdown(COUNTDOWN_DURATION); 
      resendOtp();
    }
  };

  return (
    <div className="pt-[150px] justify-items-center">
      <div className="flex items-center gap-1">
        <Image src="/logo.svg" width={20} height={24} alt="logo" className="w-5 h-6" />
        <div className="text-[#424242] font-bold text-2xl">tinder</div>
      </div>
      <div className="text-[#09090B] font-semibold text-2xl pt-6">Confirm email</div>
      <div data-cy="otp-instruction" className="text-[#71717A] text-sm font-normal pt-1 w-[314px] text-center">
        To continue, enter the secure code we sent to {email}. Check junk mail if it’s not in your inbox.
      </div>

      <InputOTP
        data-cy="otp-input"
        onComplete={(value) =>{
          verifyOtp({
            variables: {
              input: { email, otp: value },
            },
          })
        }
         
        
        }
        maxLength={4}
        pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
      >
        <InputOTPGroup className="mt-6">
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
        </InputOTPGroup>
      </InputOTP>
      <Toaster />

      <div
        className="text-[#090a90B] font-medium text-sm mt-6 cursor-pointer"
        onClick={handleResend}
      >
        {canResend ? 'Send again' : `Send again (${countdown})`}
      </div>
      <p className="text-[#71717A] text-sm pt-[35%] ">©2024 Tinder</p>
    </div>
  );
};

export default VerifyOtp;
