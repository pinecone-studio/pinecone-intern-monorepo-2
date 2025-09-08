'use client';

import { useEffect, useRef, useState, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
import { OtpInputs } from './components/OtpInputs';
import { useOtpVerification, useOtpResend } from './hooks/useOtpHooks';

type FormValues = {
  otp: string[];
};

const TimerAndResend = ({ timer, canResend, onResend }: { timer: number; canResend: boolean; onResend: () => void }) => (
  <div className="text-center mb-4">
    {timer > 0 ? (
      <p className="text-sm text-gray-500">Resend OTP in {timer} seconds</p>
    ) : (
      <button onClick={onResend} disabled={!canResend} className="text-pink-500 hover:text-pink-600 text-sm font-medium disabled:opacity-50" data-cy="resend-otp">
        Resend OTP
      </button>
    )}
  </div>
);

const VerifyOtpContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const { control, watch, setValue } = useForm<FormValues>({
    defaultValues: { otp: ['', '', '', ''] },
  });

  const otpValues = watch('otp');

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const [timer, setTimer] = useState(15);
  const [canResend, setCanResend] = useState(false);

  const otpCode = otpValues.join('');

  const { handleVerifyOtp } = useOtpVerification(email, otpCode, router);
  const { handleResend } = useOtpResend(email, otpValues, setValue, setCanResend, setTimer, inputRefs);

  useEffect(() => {
    if (otpCode.length === 4) {
      const timeout = setTimeout(handleVerifyOtp, 50);
      return () => clearTimeout(timeout);
    }
  }, [otpCode, handleVerifyOtp]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    } else if (timer === 0) {
      setCanResend(true);
    }
  }, [timer]);

  const handleChange = (index: number, value: string, onChange: (..._args: unknown[]) => void) => {
    if (!/^\d*$/.test(value)) return;
    onChange(value.slice(-1));
    if (value && index < 3) inputRefs.current[index + 1]?.focus();
  };

  const handleBackspace = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-medium mb-2 text-center" data-cy="verify-otp-title">
        Confirm email
      </h1>
      <div className="text-center mb-6">
        <p className="text-gray-500 text-m mt-1" data-cy="verify-otp-description">
          To continue, enter the secure code we sent to {email}. Check junk mail if it&apos;s not in your inbox
        </p>
      </div>

      <OtpInputs control={control} inputRefs={inputRefs} handleChange={handleChange} handleBackspace={handleBackspace} />

      <TimerAndResend timer={timer} canResend={canResend} onResend={handleResend} />
    </div>
  );
};

const VerifyOtpPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyOtpContent />
    </Suspense>
  );
};

export default VerifyOtpPage;
