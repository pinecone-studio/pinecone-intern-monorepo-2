'use client';

import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useRegisterEmailMutation } from '@/generated';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ApolloError } from '@apollo/client';

const Register = () => {
  const [email, setEmail] = useState<string>('');
  const [registerEmail, { data, loading }] = useRegisterEmailMutation();
  const router = useRouter();

  const handleRegister = async () => {
    if (!email) return toast('🫢 Oops! We need your email to sign you up', {});

    try {
      const res = await registerEmail({ variables: { input: { email } } });
      if (res?.data?.registerEmail?.email) {
        console.log('register by email failed1', data?.registerEmail?.email);
        localStorage.setItem('userEmail',email)
        router.push('/register/otp');
      } else {
        console.log('register by email failed', data?.registerEmail?.email);
      }
    } catch (error) {
      console.log(error)
      handleError(error);
    }
  };
  const handleError = (error: unknown) => {
    if (error instanceof ApolloError) {
      const message = error.message;
  
      if (message === 'email already exist') {
        toast('❗️ This email is already registered. Please use a different email or log in.');
      } else {
        toast('❗️ An unexpected error occurred. Please try again.');
      }
    } else {
      toast('❗️ An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div data-cy='register-page-container' className="pt-[200px] justify-items-center">
      <div data-cy='register-email-header' className="flex items-center gap-1">
        <Image src="../logo.svg" width={20} height={24} alt="logo" className="w-5 h-6" />
        <div  className="text-[#424242] font-bold text-2xl">tinder</div>
      </div>
      <div className="text-[#09090B] font-semibold text-2xl pt-6 ">Create an account</div>
      <div className="text-[#71717A] text-sm font-normal pt-1">Enter your email below to create your account</div>
      <div className="pt-6">
        <div className="text-[#09090B] font-medium text-sm pb-2">Email</div>
        <Input data-cy="register-email-input" placeholder="name@example.com" className="w-[350px] border-[#E4E4E7] border-2" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Button data-cy="register-continue-button"className="w-[350px] h-9 bg-[#E11D48E5] rounded-full text-[#FAFAFA] text-sm font-medium mt-4" onClick={handleRegister} disabled={loading}>
          Continue
        </Button>
        <div className="flex">
          <Separator className="my-8 w-[145px]" color="#E4E4E7" />
          <div className="my-6 text-[#71717A] font-normal text-xs mx-5">OR</div>
          <Separator className="my-8 w-[145px]" color="#E4E4E7" />
        </div>
        <Toaster />

        <Button className="w-[350px] h-9 bg-white border-[#E4E4E7] rounded-full text-[#18181B] hover:bg-white border-2 text-sm font-medium mt-4">Log in</Button>
        <div className="text-[#71717A] font-normal text-sm pt-6 text-center">By clicking continue, you agree to our</div>
        <div className="text-[#71717A] font-normal text-sm text-center underline-offset-1 underline">Terms of Service and Privacy Policy.</div>
      </div>
    </div>
  );
};
export default Register;
