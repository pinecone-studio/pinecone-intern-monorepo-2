/* eslint-disable max-lines, max-lines-per-function */
'use client';
import { useState, useEffect, Suspense } from 'react';
import { useMutation } from '@apollo/client';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { gql } from '@apollo/client';
const VERIFY_EMAIL_OTP = gql`mutation VerifyEmailOTP($email: String!, $otp: String!) {verifyEmailOTP(email: $email, otp: $otp)}`;
const SEND_VERIFICATION_EMAIL = gql`mutation SendVerificationEmail($input: SendVerificationEmailInput!) {sendVerificationEmail(input: $input)}`;
type AuthError = { message: string; code?: string; };
/*eslint-disable complexity, max-lines-per-function */
const VerifyOTPPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<AuthError | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [verifyEmailOTP, { loading: verifyLoading }] = useMutation(VERIFY_EMAIL_OTP, {
    onCompleted: () => {
      router.push('/login?message=Email verified successfully! Please sign in.');
    },
    onError: (apolloError) => {
      setError({
        message: apolloError.message,
        code: (apolloError.graphQLErrors[0]?.extensions?.code as string) || 'UNKNOWN_ERROR',
      });
    },
  });
  const [sendVerificationEmail, { loading: resendLoading }] = useMutation(SEND_VERIFICATION_EMAIL, {
    onCompleted: () => {
      setResendCooldown(60);
      setError(null);
    },
    onError: (apolloError) => {
      setError({
        message: apolloError.message,
        code: (apolloError.graphQLErrors[0]?.extensions?.code as string) || 'UNKNOWN_ERROR',
      });
    },
  });
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);
  useEffect(() => {
    if (!email) {
      router.push('/signup');
    }
  }, [email, router]);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(value);
    if (error) setError(null);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      setError({ message: 'Please enter a valid 6-digit OTP' }); 
      return;
    }
    if (!email) {
      setError({ message: 'Email address is required' });
      return;
    }
    await verifyEmailOTP({
      variables: { email, otp },
    });
  };
  const handleResendOTP = async () => {
    if (resendCooldown > 0 || !email) return;
    await sendVerificationEmail({
      variables: { input: { email } },
    });
  };
  if (!email) {
    return <div>Redirecting...</div>;
  }
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="bg-white py-8 px-8 shadow-sm border border-gray-300 rounded-sm">
          <div className="flex justify-center mb-6">
            <Image 
              src="/Instagram_logo.svg" 
              alt="Instagram" 
              width={175}
              height={48}
              className="h-12 w-auto"
              style={{ filter: 'brightness(0)' }}
            />
          </div>
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Verify Your Email</h2>
            <p className="text-sm text-gray-600 mb-4">We&apos;ve sent a verification code to:</p>
            <p className="text-sm font-medium text-gray-900 mb-4">{email}</p>
            <p className="text-xs text-gray-500">Enter the 6-digit code to verify your email address</p>
          </div>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <input
                id="otp"
                name="otp"
                type="text"
                required
                value={otp}
                onChange={handleInputChange}
                className="w-full rounded-sm border border-gray-300 bg-gray-50 py-3 px-4 text-center text-lg font-mono tracking-widest text-gray-900 placeholder:text-gray-500 focus:border-gray-400 focus:bg-white focus:outline-none"
                placeholder="000000"
                maxLength={6}
              />
            </div>
            <div>
              <button
                type="submit"
                disabled={verifyLoading || otp.length !== 6}
                className="w-full rounded-sm bg-blue-500 py-2 px-4 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300 disabled:cursor-not-allowed"
              >
                {verifyLoading ? 'Verifying...' : 'Verify Email'}
              </button>
            </div>
            {error && (
              <div className="text-center">
                <p className="text-sm text-red-600">{error.message}</p>
              </div>
            )}
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 mb-2">Didn&apos;t receive the code?</p>
            <button
              onClick={handleResendOTP}
              disabled={resendCooldown > 0 || resendLoading}
              className="text-sm text-blue-600 hover:text-blue-800 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              {resendLoading 
                ? 'Sending...' 
                : resendCooldown > 0 
                  ? `Resend in ${resendCooldown}s`
                  : 'Resend verification code'
              }
            </button>
          </div>
        </div>
        <div className="bg-white py-4 px-8 shadow-sm border border-gray-300 rounded-sm mt-2 text-center">
          <p className="text-sm text-gray-900">
            Want to use a different email?{' '}
            <Link href="/signup" className="text-blue-600 font-medium hover:text-blue-800">
              Go back to signup
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

const VerifyOTPPageWithSuspense = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyOTPPage />
    </Suspense>
  );
};

export default VerifyOTPPageWithSuspense;