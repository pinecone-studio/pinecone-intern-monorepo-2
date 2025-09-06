import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface Step2FormProps {
  email: string;
  setStep: (_step: number) => void;
}

// Exported helpers to enable direct test coverage of schema refine functions
export const passwordComplexityCheck = (data: string) => {
  if (data.length < 10) return true;
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{10,}$/.test(data);
};

export const passwordsMatch = (data: { password: string; confirmPassword: string }) => {
  return data.confirmPassword === data.password;
};

export const useStep2Form = ({ email, setStep: _setStep }: Step2FormProps) => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const schema = z
    .object({
      password: z.string().min(1, { message: 'Enter your password' }).min(10, { message: 'Password must be at least 10 characters' }).refine(passwordComplexityCheck, {
        message: 'Password must include uppercase, lowercase, and number',
      }),
      confirmPassword: z.string().min(1, { message: 'Enter your confirm password' }),
    })
    .refine(passwordsMatch, {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    });

  const { register, handleSubmit, formState } = useForm({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const handleCreateUserError = (error: unknown) => {
    if (error && typeof error === 'object' && 'response' in error) {
      const e = error as { response?: { data?: { errors?: Array<{ message?: string }> } } };
      const message = e.response?.data?.errors?.[0]?.message;
      if (message) {
        toast.error(message);
        return;
      }
    }
    toast.error('Failed to create user');
  };

  const createUserRequest = async (email: string, password: string) => {
    const response = await axios.post(
      'http://localhost:4200/api/graphql',
      {
        query: `
        mutation CreateUser($email: String!, $password: String!) {
          createUser(input: { email: $email, password: $password }) {
            status
            message
            userId
          }
        }
      `,
        variables: { email, password },
      },
      { headers: { 'Content-Type': 'application/json' } }
    );
    return response;
  };

  const handleCreateUserSuccess = (result: { status: string; userId?: string }) => {
    if (result.status === 'SUCCESS' && result.userId) {
      _setStep(1);
      // Store userId in localStorage for the create-profile page
      localStorage.setItem('userId', result.userId);
      router.push('/create-profile');
      toast.success('User created successfully');
    } else {
      console.error('Failed to create user');
      toast.error('Failed to create user');
    }
  };

  const onSubmit = async (data: { password: string; confirmPassword: string }) => {
    if (!email) {
      console.error('Email is missing from Step1!');
      return;
    }

    try {
      setLoading(true);
      const response = await createUserRequest(email, data.password);
      const result = response.data.data.createUser;
      console.log('Mutation Result:', result);
      handleCreateUserSuccess(result);
    } catch (error: unknown) {
      handleCreateUserError(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    register,
    handleSubmit,
    formState,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    loading,
    onSubmit,
  };
};
