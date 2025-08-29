import { useCallback } from 'react';
import { useMutation } from '@apollo/client';
import { toast } from 'sonner';
import { gql } from '@apollo/client';

const VERIFY_OTP = gql`
  mutation verifyOtp($input: VerifyOtpInput!) {
    verifyOtp(input: $input) {
      status
      message
    }
  }
`;

const FORGOT_PASSWORD = gql`
  mutation forgotPassword($input: ForgotPasswordInput!) {
    forgotPassword(input: $input) {
      status
      message
    }
  }
`;

type ForgotPasswordResult = {
  status: 'SUCCESS' | 'ERROR';
  message: string | null;
};

export const useOtpVerification = (email: string, otpCode: string, router: any) => {
  const [verifyOtp] = useMutation(VERIFY_OTP);
  
  const handleVerifyOtpSuccess = useCallback(() => {
    toast.success('OTP verified successfully');
    router.push(`/resetPassword?email=${email}`);
  }, [router, email]);

  const handleVerifyOtpError = useCallback((message: string | null) => {
    toast.error(message || 'Failed to verify OTP');
  }, []);

  const handleVerifyOtp = useCallback(async () => {
    try {
      const response = await verifyOtp({ variables: { input: { email, otp: otpCode } } });
      const result = response.data.verifyOtp;
      if (result.status === 'SUCCESS') {
        handleVerifyOtpSuccess();
      } else {
        handleVerifyOtpError(result.message);
      }
    } catch {
      toast.error('Something went wrong');
    }
  }, [otpCode, email, verifyOtp, handleVerifyOtpSuccess, handleVerifyOtpError]);

  return { handleVerifyOtp };
};

export const useOtpResend = (email: string, otpValues: string[], setValue: any, setCanResend: any, setTimer: any, inputRefs: any) => {
  const [forgotPassword] = useMutation(FORGOT_PASSWORD);

  const handleResendSuccess = (result: ForgotPasswordResult) => {
    if (result.status === 'SUCCESS') {
      toast.success('OTP resent successfully!');
      setTimer(15);
      inputRefs.current[0]?.focus(); 
    } else {
      toast.error(result.message || 'Failed to resend OTP');
      setCanResend(true);
    }
  };

  const handleResend = async () => {
    setCanResend(false);
    setTimer(-1); 
  
    otpValues.forEach((_, idx) => setValue(`otp.${idx}`, ''));
  
    try {
      const response = await forgotPassword({ variables: { input: { email } } });
      const result = response.data.forgotPassword;
      handleResendSuccess(result);
    } catch (err) {
      console.error(err);
      toast.error('Failed to resend OTP');
      setCanResend(true);
    }
  };

  return { handleResend };
}; 