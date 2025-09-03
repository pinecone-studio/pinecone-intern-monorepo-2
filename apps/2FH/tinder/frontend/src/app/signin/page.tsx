'use client';

import { useForm } from 'react-hook-form';
import React from 'react';
import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { toast } from 'sonner';

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      status
      message
      token
      user {
        id
        email
      }
    }
  }
`;

type FormValues = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
  const router = useRouter();

  const [login, { loading, error }] = useMutation(LOGIN_MUTATION);

  const onSubmit = async (data: FormValues) => {
    try {
      const response = await login({ variables: data });

      const result = response.data.login;

      if (result.status === 'SUCCESS') {
        localStorage.setItem('token', result.token);
        toast.success(<div data-cy="login-success">Login successful!</div>);
        router.push('/');
      } else {
        toast.error(<div data-cy="login-error">{result.message || 'Login failed'}</div>);
      }
    } catch (err) {
      console.error('Login error:', err);
      toast.error(<div data-cy="login-apollo-error">Something went wrong during login.</div>);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md bg-white p-10 border border-gray-200 rounded-xl shadow-sm">
        <div className="text-center mb-6">
          <Image src="/logo.png" alt="Tinder Logo" width={60} height={60} className="mx-auto h-15" />
          <h2 className="text-2xl font-bold mt-4">Sign in</h2>
          <p className="text-gray-500 text-sm mt-1">Enter your email below to sign in</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            {...register('email', { required: 'Email is required' })}
            placeholder="name@example.com"
            className="w-full px-4 py-3 text-sm text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 font-medium"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            {...register('password', { required: 'Password is required' })}
            placeholder="name@example.com"
            className="w-full px-4 py-3 text-sm text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 font-medium"
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          <div className="text-right mt-1">
            <a href="#" className="text-sm text-blue-500 hover:underline">
              Forgot password?
            </a>
          </div>
        </div>

        <button type="submit" disabled={loading} className="w-full bg-tinder-pink hover:bg-pink-600 text-white text-sm font-semibold py-3 rounded-2xl mt-4 transition duration-200 ease-in-out">
          {loading ? 'Logging in...' : 'Continue'}
        </button>

        {error && <p className="text-red-500 text-sm text-center mt-2">{error.message}</p>}
        <div className="flex items-center my-4">
          <hr className="flex-grow border-t border-gray-300" />
          <span className="mx-3 text-gray-500 text-xs ">OR</span>
          <hr className="flex-grow border-t border-gray-300" />
        </div>

        <button type="button" className="w-full border border-gray-300 text-gray-700  py-2 rounded-2xl hover:bg-gray-100  ">
          Create an account
        </button>

        <p className="text-xs text-gray-400 text-center mt-6">
          By clicking continue, you agree to our <a className="underline">Terms of Service</a> and <a className="underline">Privacy Policy</a>.
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
