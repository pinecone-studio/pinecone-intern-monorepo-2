import { useStep } from '../providers/stepProvider';
import axios from 'axios';
import { KeyboardEvent, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

export const ConfirmCode = () => {
  const { setStep, values } = useStep();
  const [code, setCode] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(15);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Timer countdown
  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(countdown);
    }
  }, [timer]);

  const handleChange = (value: string, index: number) => {
    if (/^\d?$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      if (value && index < code.length - 1) {
        inputsRef.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleResend = async () => {
    const email = values.email;
    if (!email) {
      toast.error('Email not found. Please go back and enter your email.');
      return;
    }

    try {
      setResending(true);
      await axios.post('http://localhost:4200/api/graphql', {
        query: `
          mutation SendOtp($email: String!) {
            sendOtp(email: $email) {
              input
              output
            }
          }
        `,
        variables: { email },
      });

      toast.success('OTP resent successfully!');
      setTimer(15); // restart countdown
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.errors?.[0]?.message || 'Failed to resend OTP');
    } finally {
      setResending(false);
    }
  };

  const handleVerify = async () => {
    const otpCode = code.join('');
    const email = values.email;

    if (!email) {
      toast.error('Email not found. Please go back and enter your email.');
      return;
    }
    if (otpCode.length !== 4) {
      toast.error('Please enter the 4-digit code.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:4200/api/graphql', {
        query: `
          mutation SignUpVerifyOtp($email: String!, $otp: String!) {
            signUpVerifyOtp(email: $email, otp: $otp) {
              input
              output
            }
          }
        `,
        variables: { email, otp: otpCode },
      });

      const data = response.data.data.signUpVerifyOtp;
      toast.success(data.output);
      setStep(3);
    } catch (error: any) {
      handleVerifyError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyError = (error: any) => {
    console.error(error);
    toast.error(error.response?.data?.errors?.[0]?.message || 'OTP verification failed');
  };

  return (
    <div className="w-[350px] h-[414px] flex flex-col items-center gap-[24px]" data-testid="confirm-code-container">
      <div className="flex-col flex items-center justify-center gap-1">
        <div>
          <img src={'/images/logo.png'} alt="logo" className="w-[100px]" data-testid="logo" />
        </div>
        <div className="text-[24px] font-semibold" data-testid="title">
          Confirm your email
        </div>
        <div className="text-[14px] text-[#71717a] text-center" data-testid="subtitle">
          To continue, enter the secure code we sent to <b>{values.email}</b>. Check junk mail if it’s not in your inbox.
        </div>
      </div>

      <div className="w-full flex flex-col gap-4 items-center">
        <div className="flex gap-2" data-testid="otp-inputs-container">
          {code.map((digit, i) => (
            <input
              key={i}
              ref={(el) => {
                if (el) {
                  inputsRef.current[i] = el;
                }
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              className="w-12 h-12 text-center text-lg border rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid={`otp-input-${i}`}
            />
          ))}
        </div>
      </div>

      {/* Verify button with loader */}
      <button
        onClick={handleVerify}
        disabled={loading || code.join('').length !== 4}
        className={`w-[100px] h-9 rounded-full text-white flex items-center justify-center hover:opacity-100 duration-200
              ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#E11D48] opacity-90'}
            `}
        data-testid="verify-button"
      >
        {loading ? 'Verifying...' : 'Verify'}
      </button>

      {/* Resend button with countdown */}
      <button onClick={handleResend} disabled={timer > 0 || resending} className={`text-sm ${timer > 0 ? 'text-gray-400' : 'text-[#E11D48] hover:underline'}`} data-testid="resend-button">
        {resending ? 'Sending...' : timer > 0 ? `Send again (${timer})` : 'Send again'}
      </button>
    </div>
  );
};
