'use client';

import { useForm } from 'react-hook-form';
import React from 'react';

type FormValues = {
  email: string;
  password: string;
};

 const LoginPage=()=> {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = (data: FormValues) => {
    console.log('data:', data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-white p-8 border border-gray-200 rounded shadow-md"
      >
        <div className="text-center mb-6">
          <img src="/Logo.png" alt="Tinder Logo" className="mx-auto h-12" />
          <h2 className="text-2xl font-bold mt-4">Sign in</h2>
          <p className="text-gray-500 text-sm mt-1">
            Enter your email below to sign in
          </p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            {...register('email', { required: 'Email is required' })}
            placeholder="name@example.com"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            {...register('password', { required: 'Password is required' })}
            placeholder="••••••••"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
          <div className="text-right mt-1">
            <a href="#" className="text-sm text-pink-500 hover:underline">
              Forgot password?
            </a>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 rounded mt-4"
        >
          Continue
        </button>

        <div className="my-4 text-center text-gray-500 text-sm">OR</div>

        <button
          type="button"
          className="w-full border border-gray-300 text-gray-700 font-semibold py-2 rounded hover:bg-gray-100"
        >
          Create an account
        </button>

        <p className="text-xs text-gray-400 text-center mt-6">
          By clicking continue, you agree to our{' '}
          <a className="underline">
            Terms of Service
          </a>{' '}
          and{' '}
          <a  className="underline">
            Privacy Policy
          </a>
          .
        </p>
      </form>
    </div>
  );
}
export default LoginPage
