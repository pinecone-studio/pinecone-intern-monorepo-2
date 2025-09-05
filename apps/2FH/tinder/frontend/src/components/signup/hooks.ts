import { useState, useEffect, useRef, KeyboardEvent } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

export const useTimer = (initialTime: number) => {
  const [timer, setTimer] = useState(initialTime);

  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(countdown);
    }
  }, [timer]);

  const resetTimer = () => setTimer(initialTime);

  return { timer, resetTimer };
};

export const useOtpCode = () => {
  const [code, setCode] = useState(['', '', '', '']);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

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

  return { code, inputsRef, handleChange, handleKeyDown };
};

export const useOtpResend = (email: string, resetTimer: () => void) => {
  const [resending, setResending] = useState(false);

  const sendOtpRequest = async () => {
    return axios.post('http://localhost:4200/api/graphql', {
      query: `
        mutation SendOtp($email: String!) {
          signupSendOtp(email: $email) {
            input
            output
          }
        }
      `,
      variables: { email },
    });
  };

  const handleResendError = (error: unknown) => {
    const errorMessage =
      error instanceof Error && 'response' in error ? (error as { response?: { data?: { errors?: Array<{ message?: string }> } } }).response?.data?.errors?.[0]?.message : 'Failed to resend OTP';
    toast.error(errorMessage || 'Failed to resend OTP');
  };

  const handleResend = async () => {
    if (!email) {
      toast.error('Email not found. Please go back and enter your email.');
      return;
    }

    try {
      setResending(true);
      await sendOtpRequest();
      toast.success('OTP resent successfully!');
      resetTimer();
    } catch (error: unknown) {
      handleResendError(error);
    } finally {
      setResending(false);
    }
  };

  return { resending, handleResend };
};

export const useOtpVerification = (email: string, code: string[], setStep: (_step: number) => void) => {
  const [loading, setLoading] = useState(false);

  const validateInputs = () => {
    if (!email) {
      toast.error('Email not found. Please go back and enter your email.');
      return false;
    }
    if (code.join('').length !== 4) {
      toast.error('Please enter the 4-digit code.');
      return false;
    }
    return true;
  };

  const sendVerifyRequest = async () => {
    return axios.post('http://localhost:4200/api/graphql', {
      query: `
        mutation SignUpVerifyOtp($email: String!, $otp: String!) {
          signUpVerifyOtp(email: $email, otp: $otp) {
            input
            output
          }
        }
      `,
      variables: { email, otp: code.join('') },
    });
  };

  const handleVerifyError = (error: unknown) => {
    const errorMessage =
      error instanceof Error && 'response' in error ? (error as { response?: { data?: { errors?: Array<{ message?: string }> } } }).response?.data?.errors?.[0]?.message : 'OTP verification failed';
    toast.error(errorMessage || 'OTP verification failed');
  };

  const handleVerify = async () => {
    if (!validateInputs()) return;

    setLoading(true);
    try {
      const response = await sendVerifyRequest();
      const data = response.data.data.signUpVerifyOtp;
      toast.success(data.output);
      setStep(3);
    } catch (error: unknown) {
      handleVerifyError(error);
    } finally {
      setLoading(false);
    }
  };

  return { loading, handleVerify };
};
