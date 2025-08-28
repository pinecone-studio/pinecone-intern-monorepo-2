'use client';

import { useState} from 'react';
import { useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { gql } from '@apollo/client';
import { LoginFormData, AuthError } from '@/components/auth/types';
import { ErrorDisplay } from '@/components/auth/ErrorDisplay';

const LOGIN_USER = gql`
  mutation LoginUser($input: LoginInput!) {
    loginUser(input: $input) {
      user { _id fullName userName email profileImage }
      token
    }
  }
`;

const LoginPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginFormData>({ identifier: '', password: '' });
  const [error, setError] = useState<AuthError | null>(null);

  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    onCompleted: (data) => {
      localStorage.setItem('token', data.loginUser.token);
      localStorage.setItem('user', JSON.stringify(data.loginUser.user));
      router.push('/');
    },
    onError: (apolloError) => {
      setError({
        message: apolloError.message,
        code: (apolloError.graphQLErrors[0]?.extensions?.code as string) || 'UNKNOWN_ERROR',
      });
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.identifier || !formData.password) {
      setError({ message: 'Please fill in all fields' });
      return;
    }
    await loginUser({ variables: { input: formData } });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="bg-white py-8 px-8 shadow-sm border border-gray-300 rounded-sm">
          <div className="flex justify-center mb-8">
            <Image 
              src="/Instagram_logo.svg" 
              alt="Instagram" 
              width={175}
              height={48}
              className="h-12 w-auto"
              style={{ filter: 'brightness(0)' }}
              priority
            />
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <ErrorDisplay error={error} />

            <div>
              <input
                id="identifier"
                name="identifier"
                type="text"
                required
                value={formData.identifier}
                onChange={handleInputChange}
                className="w-full rounded-sm border border-gray-300 bg-gray-50 py-2 px-2 text-sm text-gray-900 placeholder:text-gray-500 focus:border-gray-400 focus:bg-white focus:outline-none"
                placeholder="Username, phone number, or email"
              />
            </div>

            <div>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="w-full rounded-sm border border-gray-300 bg-gray-50 py-2 px-2 text-sm text-gray-900 placeholder:text-gray-500 focus:border-gray-400 focus:bg-white focus:outline-none"
                placeholder="Password"
              />
            </div>

            <div className="flex justify-center">
              <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800">
                Forgot password?
              </Link>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-sm bg-blue-500 py-2 px-4 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300 disabled:cursor-not-allowed"
              >
                {loading ? 'Logging in...' : 'Log in'}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white py-4 px-8 shadow-sm border border-gray-300 rounded-sm mt-2 text-center">
          <p className="text-sm text-gray-900">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-blue-600 font-medium hover:text-blue-800">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;