'use client';

import Image from 'next/image';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import logo from '@/components/logo.png';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useLogin } from '@/context/LoginContext';
import { useCheckOtpMutation } from '@/generated';
import { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-toastify'; 
import { useRouter } from 'next/navigation';

const SendOtp = () => {
  const { email } = useLogin();
  const [checkOtp, { loading, error }] = useCheckOtpMutation();
  const [otp, setOTP] = useState<string>('');
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const router = useRouter()
  


  const login = useCallback(async () => {
    
    if (otp.length !== 4) return;
    try {
      const response = await checkOtp({ variables: { email, otp } });
      if (response?.data?.checkOTP) {
        setIsVerified(true);
        toast.success('OTP Verified Successfully');
        setToken(response.data.checkOTP)
        router.push('./')
      } else {
        toast.error('Invalid OTP. Please try again.');
      }
    } catch (e) {
      toast.error('An error occurred while verifying the OTP.');
    }
  }, [email, otp, checkOtp]);

  useEffect(() => {
    if (otp.length === 4) {
      login();
    }
  }, [otp, login]);

  return (
    <div className="mt-24" data-testid='check-otp-modal'>
      <Card className="bg-white w-[500px] h-full m-auto mx-auto p-10">
        <h1 className="font-bold text-center my-6">Нэвтрэх</h1>
        <Image src={logo.src} alt="logo" width={150} height={150} className="mx-auto" />
        <div className="mt-8 flex flex-col items-center">
          <Label className="my-4">
            И-мэйлээ шалгаад код оо оруулна уу.
          </Label>
          <InputOTP maxLength={4} onChange={(value) => setOTP(value)} className="mx-auto">
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
            </InputOTPGroup>
          </InputOTP>
        </div>

        {loading && (
          <div className="mt-4 text-center text-gray-500">Verifying OTP...</div>
        )}
        {error && (
          <div className="mt-4 text-center text-red-500">{error.message}</div>
        )}

        {isVerified && (
          <div className="mt-4 text-center text-green-500">OTP Verified! Proceeding to login...</div>
        )}

        <div className="flex justify-between p-6 items-center">
          <Link href="/login">
            <ArrowLeft />
          </Link>
          <Link href="/">
            <RefreshCw />
          </Link>
        </div>
      </Card>
    </div>
  );
};

const setToken = (token: string) => {
    fetch(`/token?token=${token}`)
}


export default SendOtp;
