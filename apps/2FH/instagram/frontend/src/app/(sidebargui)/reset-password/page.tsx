/* eslint-disable complexity, max-lines */
'use client';
import { useState, useEffect, Suspense } from 'react';
import { useMutation } from '@apollo/client';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { gql } from '@apollo/client';
const RESET_PASSWORD = gql`mutation ResetPassword($input: ResetPasswordInput!) {resetPassword(input: $input)}`;
const FORGOT_PASSWORD = gql`mutation ForgotPassword($input: ForgotPasswordInput!){forgotPassword(input: $input)}`;
type AuthError = { message: string; code?: string; };
const ResetPasswordPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const identifier = searchParams.get('identifier') || '';
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<AuthError | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [resetPassword, { loading: resetLoading }] = useMutation(RESET_PASSWORD, {
    onCompleted: () => {
      router.push('/login?message=Password reset successfully! Please sign in with your new password.');
    },
    onError: (apolloError) => {
      setError({
        message: apolloError.message,
        code: (apolloError.graphQLErrors[0]?.extensions?.code as string) || 'UNKNOWN_ERROR',
      });
    },
  });
  const [forgotPassword, { loading: resendLoading }] = useMutation(FORGOT_PASSWORD, {
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
    if (!identifier) {
      router.push('/forgot-password');
    }
  }, [identifier, router]);
  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(value);
    if (error) setError(null);
  };
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
    if (error) setError(null);
  };
  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    if (error) setError(null);
  };
  const validateForm = () => {
    if (!otp || otp.length !== 6) {
      setError({ message: 'Please enter a valid 6-digit code' });
      return false;
    }
    if (!newPassword || newPassword.length < 6) {
      setError({ message: 'Password must be at least 6 characters long' });
      return false;
    }
    if (newPassword !== confirmPassword) {
      setError({ message: 'Passwords do not match' });
      return false;
    }
    return true;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    await resetPassword({
      variables: { input: { identifier, otp, newPassword } },
    });
  };
  const handleResendCode = async () => {
    if (resendCooldown > 0 || !identifier) return;
    await forgotPassword({ variables: { input: { identifier } } });
  };
  if (!identifier) return <div>Redirecting...</div>;
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="bg-white py-8 px-8 shadow-sm border border-gray-300 rounded-sm">
          <div className="flex justify-center mb-6">
            <Image src="/Instagram_logo.svg" alt="Instagram" width={175} height={48} className="h-12 w-auto" style={{ filter: 'brightness(0)' }} priority={true} />
          </div>
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Reset Your Password</h2>
            <p className="text-sm text-gray-600 mb-4">Enter the 6-digit code we sent to your email and create a new password.</p>
            <p className="text-xs text-gray-500">Code expires in 10 minutes</p>
          </div>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">Verification Code</label>
              <input id="otp" name="otp" type="text" required value={otp} onChange={handleOtpChange} className="w-full rounded-sm border border-gray-300 bg-gray-50 py-3 px-4 text-center text-lg font-mono tracking-widest text-gray-900 placeholder:text-gray-500 focus:border-gray-400 focus:bg-white focus:outline-none" placeholder="000000" maxLength={6} />
            </div>
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <div className="relative">
                <input id="newPassword" name="newPassword" type={showPassword ? 'text' : 'password'} required value={newPassword} onChange={handlePasswordChange} className="w-full rounded-sm border border-gray-300 bg-gray-50 py-3 px-4 pr-12 text-sm text-gray-900 placeholder:text-gray-500 focus:border-gray-400 focus:bg-white focus:outline-none" placeholder="New password" minLength={6} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {showPassword ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    )}
                  </svg>
                </button>
              </div>
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
              <input id="confirmPassword" name="confirmPassword" type={showPassword ? 'text' : 'password'} required value={confirmPassword} onChange={handleConfirmPasswordChange} className="w-full rounded-sm border border-gray-300 bg-gray-50 py-3 px-4 text-sm text-gray-900 placeholder:text-gray-500 focus:border-gray-400 focus:bg-white focus:outline-none" placeholder="Confirm new password" minLength={6} />
            </div>
            <div>
              <button type="submit" disabled={resetLoading || otp.length !== 6 || !newPassword || !confirmPassword} className="w-full rounded-sm bg-blue-500 py-2 px-4 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300 disabled:cursor-not-allowed">
                {resetLoading ? 'Resetting Password...' : 'Reset Password'}
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
            <button onClick={handleResendCode} disabled={resendCooldown > 0 || resendLoading} className="text-sm text-blue-600 hover:text-blue-800 disabled:text-gray-400 disabled:cursor-not-allowed">
              {resendLoading ? 'Sending...' : resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend code'}
            </button>
          </div>
        </div>
        <div className="bg-white py-4 px-8 shadow-sm border border-gray-300 rounded-sm mt-2 text-center">
          <p className="text-sm text-gray-900">
            Remember your password?{' '}
            <Link href="/login" className="text-blue-600 font-medium hover:text-blue-800">Back to login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
const ResetPasswordPageWithSuspense = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordPage />
    </Suspense>
  );
};
export default ResetPasswordPageWithSuspense;