'use client';
import { useVerifyOtpMutation } from '@/generated/index';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { ReSendOtp } from './resendotp/ReSendOtp';
import { toast } from 'sonner';
import { useEffect } from 'react';
import { useOtpContext } from '@/components/providers';

export const EmailValidate = () => {
  const { email, startTime, otp, timeLeft, setOtp, setStep } = useOtpContext();
  const [VerifyOtp] = useVerifyOtpMutation();

  const handleVerifyOtp = async () => {
    try {
      await VerifyOtp({
        variables: {
          input: {
            email,
            otp,
          },
        },
      });

      toast.success('Your email has been successfully verified.');
      setStep(3);
    } catch {
      toast.error('Invalid OTP');
    }
  };

  useEffect(() => {
    if (otp.length === 4) {
      handleVerifyOtp();
    }
  }, [otp]);

  useEffect(() => {
    if (otp.length === 4) {
      handleVerifyOtp();
    }
  }, [startTime]);

  return (
    <div data-cy="Email-Validate-Container" className="flex flex-col items-center gap-4 w-3/4">
      <h3 className="font-semibold text-[30px]">Confirm email</h3>
      <p className="opacity-50 text-center">Enter the code sent to {email}</p>

      <InputOTP data-cy="Otp-Inputs" data-testid="input-otp" disabled={timeLeft === 0} maxLength={4} value={otp} onChange={setOtp}>
        <InputOTPGroup>
          {[0, 1, 2, 3].map((i) => (
            <InputOTPSlot key={i} index={i} />
          ))}
        </InputOTPGroup>
      </InputOTP>

      <div data-cy="Resent-Otp-Container" className="flex gap-3 items-center">
        <ReSendOtp />
        <div data-cy="Time-Left-Count-Down" className="opacity-70">
          {timeLeft}
        </div>
      </div>
    </div>
  );
};
