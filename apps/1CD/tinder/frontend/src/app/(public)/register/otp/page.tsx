'use client';

import Image from 'next/image';
import { REGEXP_ONLY_DIGITS_AND_CHARS } from 'input-otp';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { useVerifyOtpMutation } from '@/generated';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const VerifyOtp = () => {
  // const [countdown,setCountdown]=useState(15);
  // const [canResend,setCanResend]=useState(false);
  const [email, setEmail] = useState('');
  const router = useRouter();
  
  useEffect(() => {
    const storedEmail = localStorage.getItem('userEmail') || '';
    if (storedEmail) {
      setEmail(storedEmail);
    }
  },[]);

  const [verifyOtp] = useVerifyOtpMutation();

  const handleOtp = async (value: string) => {
    try {
      const res = await verifyOtp({
        variables: {
          input: {
            email,
            otp: Number(value),
          },
        },
      });
      console.log(res?.data)
      if (res?.data?.verifyOtp?.email) {
        toast.success('Otp is verified');
        router.push('/register/password');
      }else{
        throw new Error;
      }
    } catch (error) {
      toast.error('Invalid OTP. Please try again.');
    }
  };

  // useEffect(()=>{
  //   if(countdown===0){
  //     setCanResend(true);
  //     return
  //   }
  //   const timer=setTimeout(()=>setCountdown((prev)=>prev-1),1000);
  //   return ()=>clearTimeout(timer);
  // },[countdown])

  // const handleResendOtp=async()=>{
  //   if(!canResend) return;
  //   try{
  //     await sendOtp{
  //       variables:{
  //         input:{
  //           email
  //         }
  //       }
  //     };
  //     setCountdown(15);
  //     setCanResend(false);
  //     toast.success('New OTP sent to your email');
  //   }catch(error){
  //     toast.error('Failed to send OTP. Please try again.');
  //   }

  // }

  return (
    <div className="pt-[200px] justify-items-center">
      <div className="flex items-center gap-1">
        <Image src="../logo.svg" width={20} height={24} alt="logo" className="w-5 h-6" />
        <div className="text-[#424242] font-bold text-2xl">tinder</div>
      </div>
      <div className="text-[#09090B] font-semibold text-2xl pt-6 ">Confirm email</div>
      <div data-cy="otp-instruction" className="text-[#71717A] text-sm font-normal pt-1 w-[314px] text-center">
        To continue, enter the secure code we sent to {email}. Check junk mail if it’s not in your inbox.
      </div>

      <InputOTP data-cy="otp-input" onComplete={handleOtp} maxLength={4} pattern={REGEXP_ONLY_DIGITS_AND_CHARS}>
        <InputOTPGroup className="mt-6">
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
        </InputOTPGroup>
      </InputOTP>
      <Toaster />

      <div className="text-[#090a90B] font-medium text-sm mt-6">Send again (15)</div>
    </div>
  );
};
export default VerifyOtp;
