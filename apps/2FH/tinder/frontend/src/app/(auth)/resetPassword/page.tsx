'use client';

import { useState, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { gql, useMutation } from '@apollo/client';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { PasswordForm } from './components/PasswordForm';

const RESET_PASSWORD = gql`
  mutation resetPassword($input: ResetPasswordInput!) {
    resetPassword(input: $input) {
      status
      message
    }
  }
`;

type FormValues = {
  password: string;
  confirmPassword: string;
};

type ResetPasswordResult = {
  status: 'SUCCESS' | 'ERROR';
  message: string | null;
};

const ResetPasswordContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const [resetPassword, { loading }] = useMutation(RESET_PASSWORD);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validatePasswords = (data: FormValues) => {
    if (data.password !== data.confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleApiResponse = (result: ResetPasswordResult) => {
    if (result.status === 'SUCCESS') {
      toast.success('Password reset successfully');
      router.push('/signin');
    } else {
      toast.error(result.message || 'Failed to reset password');
    }
  };

  const handleApiError = () => {
    toast.error('Something went wrong');
  };

  const handlePasswordReset = async (data: FormValues) => {
    if (!validatePasswords(data)) return;

    try {
      const response = await resetPassword({
        variables: { input: { email, newPassword: data.password } },
      });

      const result = response.data.resetPassword;
      handleApiResponse(result);
    } catch (err) {
      console.error(err);
      handleApiError();
    }
  };

  const onSubmit = handlePasswordReset;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg">
      <h1 className="text-2xl font-medium mb-2 text-center">Set new Password</h1>
      <div className="text-center mb-6">
        <p className="text-gray-500 text-sm mt-1">
          Use a minimum of 10 characters, including uppercase letters, lowercase letters, and numbers
        </p>
      </div>
      
      <PasswordForm
        register={register}
        errors={errors}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        showConfirmPassword={showConfirmPassword}
        setShowConfirmPassword={setShowConfirmPassword}
        onSubmit={onSubmit}
        loading={loading}
        handleSubmit={handleSubmit}
      />
    </div>
  );
};

const ResetPasswordPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
};

export default ResetPasswordPage;
