'use client';

import { useForm } from 'react-hook-form';
import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const FORGOT_PASSWORD = gql`
  mutation forgotPassword($input: ForgotPasswordInput!) {
    forgotPassword(input: $input) {
      status
      message
    }
  }
`;

type FormValues = {
  email: string;
};

const ForgetPasswordPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
  const router = useRouter();

  const [forgotPassword, { loading }] = useMutation(FORGOT_PASSWORD);

  const onSubmit = async (data: FormValues) => {
    try {
      const response = await forgotPassword({ variables: { input: data } });
      const result = response.data.forgotPassword;

      if (result.status === 'SUCCESS') {
        toast.success('OTP sent to your email');
        router.push(`/verifyOtp?email=${data.email}`);
      } else {
        toast.error(result.message || 'Failed to send OTP');
      }
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-medium mb-2 text-center">Forgot Password</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="text-center mb-6">
          <p className="text-gray-500 text-sm mt-1">Enter your email account to reset password</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            {...register('email', { required: 'Email is required' })}
            placeholder="name@example.com"
            className="w-full px-4 py-3 text-sm text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 font-medium"
            data-cy="email-input"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1" data-cy="email-error">
              {errors.email.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-tinder-pink hover:bg-pink-600 text-white text-sm font-semibold py-3 rounded-2xl mt-4 transition duration-200 ease-in-out"
          data-cy="submit-button"
        >
          {loading ? 'Sending...' : 'Continue'}
        </button>
      </form>
    </div>
  );
};

export default ForgetPasswordPage;
