'use client';
/* eslint-disable max-lines, max-lines-per-function */
import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { gql } from '@apollo/client';
const FORGOT_PASSWORD = gql`
  mutation ForgotPassword($input: ForgotPasswordInput!) {
    forgotPassword(input: $input)
  }
`;
type AuthError = { message: string; code?: string; };
const ForgotPasswordPage = () => {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [error, setError] = useState<AuthError | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [forgotPassword, { loading }] = useMutation(FORGOT_PASSWORD, {
    onCompleted: () => {
      setIsSubmitted(true);
      setError(null);
    },
    onError: (apolloError) => {
      setError({
        message: apolloError.message,
        code: (apolloError.graphQLErrors[0]?.extensions?.code as string) || 'UNKNOWN_ERROR',
      });},});
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIdentifier(e.target.value);
    if (error) setError(null);};
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    if (!identifier.trim()) {
      setError({ message: 'Please enter your email or username' });
      return;}
    await forgotPassword({
      variables: { input: { identifier: identifier.trim() } },
    });};
  const handleProceedToReset = () => {
    const email = identifier.includes('@') ? identifier : '';
    router.push(`/reset-password?identifier=${encodeURIComponent(identifier)}&email=${encodeURIComponent(email)}`);
  };
  if (isSubmitted) {
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
                priority={true}
              />
            </div>           
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Check Your Email</h2>
              <p className="text-sm text-gray-600 mb-4">
                We&apos;ve sent a password reset code to your email address.
              </p>
              <p className="text-xs text-gray-500 mb-6">
                The code will expire in 10 minutes.
              </p>
            </div>
            <div>
              <button
                onClick={handleProceedToReset}
                className="w-full rounded-sm bg-blue-500 py-2 px-4 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Enter Reset Code
              </button>
            </div>
          </div>
          <div className="bg-white py-4 px-8 shadow-sm border border-gray-300 rounded-sm mt-2 text-center">
            <p className="text-sm text-gray-900">
              Remember your password?{' '}
              <Link href="/login" className="text-blue-600 font-medium hover:text-blue-800">
                Back to login
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
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
              priority={true}
            />
          </div>         
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Trouble with logging in?</h2>
            <p className="text-sm text-gray-600">
              Enter your email address or username and we&apos;ll send you a link to get back into your account.
            </p>
          </div>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <input
                id="identifier"
                name="identifier"
                type="text"
                required
                value={identifier}
                onChange={handleInputChange}
                className="w-full rounded-sm border border-gray-300 bg-gray-50 py-3 px-4 text-sm text-gray-900 placeholder:text-gray-500 focus:border-gray-400 focus:bg-white focus:outline-none"
                placeholder="Email address or username"
              />
            </div>
            <div>
              <button
                type="submit"
                disabled={loading || !identifier.trim()}
                className="w-full rounded-sm bg-blue-500 py-2 px-4 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending...' : 'Send Reset Code'}
              </button>
            </div>
            {error && (
              <div className="text-center">
                <p className="text-sm text-red-600">{error.message}</p>
              </div>
            )}
          </form>
          <div className="mt-6">
            <div className="relative"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">OR</span>
              </div>
            </div>
            <div className="mt-6 text-center">
              <Link href="/signup"className="text-sm text-blue-600 font-medium hover:text-blue-800">Create new account </Link>
            </div>
          </div>
        </div><div className="bg-white py-4 px-8 shadow-sm border border-gray-300 rounded-sm mt-2 text-center">
          <p className="text-sm text-gray-900"><Link href="/login" className="text-blue-600 font-medium hover:text-blue-800">Back to login</Link></p></div></div></div>);};
export default ForgotPasswordPage;