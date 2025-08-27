'use client';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSendOtpMutation } from '@/generated/index';
import Link from 'next/link';
import { LoadingSvg } from './assets/LoadingSvg';
import { useState } from 'react';
import { useOtpContext } from '@/components/providers';

export const EnterEmail = () => {
  const { email, setEmail, setStep, setStartTime } = useOtpContext();
  const [SendOtp, { loading, error }] = useSendOtpMutation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const handleCreateUserEmail = async () => {
    try {
      await SendOtp({
        variables: {
          email,
        },
      });
      toast.success("We've sent OTP code. Please verify.");
      setStartTime(true);
      setStep(2);
    } catch (error) {
      setErrorMessage('Enter email error');
    }
  };

  return (
    <div data-cy="Enter-Email-Component-Container" className="flex flex-col items-center justify-center gap-4 ">
      <div className="flex flex-col items-center px-8 py-5">
        <h3 className="font-semibold text-[30px] opacity-80">Create an account</h3>
        <p className="opacity-50 font-normal">Enter your email below to create your account</p>
      </div>
      <div className="w-full h-full flex flex-col gap-2">
        <div className="opacity-80">Email</div>
        <Input data-cy="Enter-Email-Input" data-testid="email-input" type="email" name="email" placeholder="email@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />

        {error && (
          <div data-cy="Error-Input-Value" className="text-red-500">
            {errorMessage}
          </div>
        )}
        <Button
          data-cy="Create-User-Email-Btn"
          data-testid="create-user-email-button"
          variant="outline"
          className="w-full text-white bg-[#2563EB] hover:bg-[#2570EB] hover:text-white"
          onClick={handleCreateUserEmail}
          disabled={loading}
        >
          {loading ? <LoadingSvg /> : 'Continue'}
        </Button>
      </div>
      <div className="flex w-full items-center gap-2">
        <div className="w-full border-t my-4"></div>
        <div className="opacity-50 text-[12px]">OR</div>
        <div className="w-full border-t my-4"></div>
      </div>

      <Link href="/login">
        <p className="w-full underline">Login</p>
      </Link>

      <div className="w-[55%]">
        <div className="w-full h-fit text-center opacity-50">By clicking continue, you agree to our Terms of Service and Privacy Policy.</div>
      </div>
    </div>
  );
};
