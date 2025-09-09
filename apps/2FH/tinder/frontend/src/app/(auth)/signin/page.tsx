'use client';

import { useForm } from 'react-hook-form';
import React from 'react';
import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useUser } from '@/contexts/UserContext';

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
  const { login: loginUser } = useUser();

  const [login, { loading, error }] = useMutation(LOGIN_MUTATION);

  const onSubmit = async (data: FormValues) => {
    try {
      const response = await login({ variables: data });

      const result = response.data.login;

      if (result.status === 'SUCCESS') {
        // Use UserContext to store user data and token
        loginUser(result.user, result.token);

        // Clear any old userId from localStorage and store current user's ID
        localStorage.removeItem('userId');
        localStorage.setItem('userId', result.user.id);

        toast.success(<div data-cy="login-success">Login successful!</div>);
        router.push('/chat');
      } else {
        toast.error(<div data-cy="login-error">{result.message || 'Login failed'}</div>);
      }
    } catch (err) {
      console.error('Login error:', err);
      toast.error(<div data-cy="login-apollo-error">Something went wrong during login.</div>);
    }
  };

  return (
    <div className="max-w-md mx-auto pt-[100px]">
      <img
        src="https://res.cloudinary.com/dlk2by5fg/image/upload/v1757330012/TinderLogo-2017_2_3_attqen.png"
        alt="Tinder Logo"
        className="mx-auto mb-3 w-[130px] h-auto"
      />

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow-sm">
        <div className="text-2xl font-semibold text-center mb-1">Sign in</div>
        <div className="text-center mb-4">
          <p className="text-gray-500 text-sm">Enter your email below to sign in</p>
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            {...register('email', { required: 'Email is required' })}
            placeholder="name@example.com"
            data-cy="email-input"
            className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 font-medium"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1" data-cy="email-error">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            {...register('password', { required: 'Password is required' })}
            placeholder="••••••••"
            data-cy="password-input"
            className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 font-medium"
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1" data-cy="password-error">
              {errors.password.message}
            </p>
          )}
          <div className="text-right mt-1">
            <a href="/forgotPassword" className="text-xs text-blue-500 hover:underline" data-cy="forgot-password">
              Forgot password?
            </a>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          data-cy="continue-button"
          className="w-full bg-tinder-pink hover:bg-pink-600 text-white text-sm font-semibold py-2.5 rounded-2xl mt-3 transition duration-200 ease-in-out disabled:opacity-50"
        >
          {loading ? 'Logging in...' : 'Continue'}
        </button>

        {error && <p className="text-red-500 text-xs text-center mt-2">{error.message}</p>}

        <div className="flex items-center my-3">
          <hr className="flex-grow border-t border-gray-300" />
          <span className="mx-3 text-gray-500 text-xs">OR</span>
          <hr className="flex-grow border-t border-gray-300" />
        </div>

        <button
          type="button"
          data-cy="create-account"
          className="w-full border border-gray-300 text-gray-700 py-2 rounded-2xl hover:bg-gray-50 transition duration-200"
        >
          Create an account
        </button>

        <p className="text-xs text-gray-400 text-center mt-4">
          By clicking continue, you agree to our <a className="underline hover:text-gray-600">Terms of Service</a> and <a className="underline hover:text-gray-600">Privacy Policy</a>.
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
