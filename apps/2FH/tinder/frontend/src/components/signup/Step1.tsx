import { useStep } from '../providers/StepProvider';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';

export const Step1 = () => {
  const { setStep, setValues } = useStep();
  const [loading, setLoading] = useState(false);

  const schema = z.object({
    email: z.string().min(1, { message: 'Enter your email' }).email({ message: 'Invalid email address' }),
  });

  const {
    register,
    handleSubmit,

    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: { email: '' },
  });

  const handleGraphQLErrors = (errors: Array<{ message?: string }>) => {
    const message = errors[0]?.message || 'Something went wrong';

    if (message === 'Email is already registered') {
      toast.error('Email is already registered. Please log in.');
    } else if (message === 'Failed to send OTP') {
      toast.error('Failed to send OTP. Please try again later.');
    } else {
      toast.error(message);
    }
  };

  const sendOtpRequest = async (email: string) => {
    return await axios.post(process.env.NEXT_PUBLIC_BACKEND_URI ?? '/api/graphql', {
      query: `
        mutation SignupSendOtp($email: String!) {
          signupSendOtp(email: $email) {
            output
          }
        }
      `,
      variables: { email },
    });
  };

  const handleSuccess = (response: { data: { data: { signupSendOtp: { output: string } } } }) => {
    console.log('SendOtp Response:', response.data);
    setStep(2);
  };

  const handleError = (err: unknown) => {
    const errorMessage =
      err instanceof Error && 'response' in err ? (err as { response?: { data?: { errors?: Array<{ message?: string }> } } }).response?.data?.errors?.[0]?.message : 'Something went wrong';
    toast.error(errorMessage);
  };
  async function onSubmit(data: z.infer<typeof schema>) {
    try {
      setLoading(true);
      setValues((prev) => ({ ...prev, email: data.email }));

      const response = await sendOtpRequest(data.email);
      const graphqlErrors = response.data?.errors;
      logGraphQLErrors(graphqlErrors);

      if (graphqlErrors && graphqlErrors.length > 0) {
        handleGraphQLErrors(graphqlErrors);
        return;
      }

      handleSuccess(response);
    } catch (err: unknown) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  }

  const logGraphQLErrors = (errors: Array<{ message?: string }> | undefined) => {
    console.log('Graphql Errors:', errors?.[0]?.message);
  };

  return (
    <div className="w-[350px] h-[414px] flex flex-col gap-6 items-center" data-testid="step1-container">
      <div className="flex flex-col items-center">
        <Image src="/images/logo.png" alt="logo" width={130} height={100} className="w-[130px]" data-testid="logo" />
        <div className="text-[24px] font-semibold mb-1 mt-6" data-testid="title">
          Create an account
        </div>
        <div className="text-[14px] text-center text-[#71717a] mb-3" data-testid="subtitle">
          Enter your email below to create your account
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-4" data-testid="signup-form">
        <div className="flex flex-col gap-3 w-full">
          <div className="text-[14px]" data-testid="email-label">
            Email
          </div>
          <input type="email" {...register('email')} placeholder="Enter your email" className="border-[1px] border-[#E4E4E7] h-9 w-full rounded-[6px] pl-4" data-testid="email-input" />
          {errors.email && (
            <p className="text-red-500 text-[12px]" data-testid="email-error">
              {errors.email.message}
            </p>
          )}
          <button
            type="submit"
            disabled={loading || !isValid}
            className={`w-full h-9 rounded-full text-white flex items-center justify-center hover:opacity-100 duration-200
              ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#E11D48] opacity-90'}
            `}
            data-testid="submit-button"
          >
            {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" data-testid="loading-spinner"></div> : 'Continue'}
          </button>
        </div>

        <div className="flex w-full h-9 items-center" data-testid="divider">
          <div className="flex-1 h-[1px] bg-[#e4e4e7]"></div>
          <div className="flex items-center justify-center w-9 h-full font-light text-[#71717a]" data-testid="or-text">
            OR
          </div>
          <div className="flex-1 h-[1px] bg-[#e4e4e7]"></div>
        </div>

        <Link href="/signin" className="w-full flex items-center justify-center h-9 rounded-full border-[1px] border-[#e4e4e7]" data-testid="login-link">
          Log in
        </Link>
      </form>

      <div className="w-[249px] text-[14px] text-[#71717a] text-center" data-testid="terms-text">
        By clicking continue, you agree to our Terms of Service and Privacy Policy.
      </div>
    </div>
  );
};
