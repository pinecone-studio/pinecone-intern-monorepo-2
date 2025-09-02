'use client';

import { useState} from 'react';
import { useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { gql } from '@apollo/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const CREATE_USER = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      _id
      fullName
      userName
      email
      gender
      createdAt
    }
  }
`;
type SignupFormData = { email: string; password: string; fullName: string; userName: string; gender: string; };
type AuthError = { message: string; code?: string; }; 
// eslint-disable-next-line complexity
const validateForm = (formData: SignupFormData): AuthError | null => {
  if (!formData.email || !formData.password || !formData.fullName || !formData.userName || !formData.gender) {
    return { message: 'Please fill in all fields' };
  }
  if (formData.password.length < 6) {
    return { message: 'Password must be at least 6 characters long' };
  }
  return null;
};

// eslint-disable-next-line complexity
const SignupPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<SignupFormData>({ email: '', password: '', fullName: '', userName: '', gender: '' });
  const [error, setError] = useState<AuthError | null>(null);
  const [createUser, { loading }] = useMutation(CREATE_USER, {
    onCompleted: (_data) => { /* istanbul ignore next */
      if (formData.email) {
        router.push(`/verify-otp?email=${encodeURIComponent(formData.email)}`);
        /* istanbul ignore next */
      } else { /* istanbul ignore next */
        router.push('/login?message=Account created successfully! Please sign in.');
        /* istanbul ignore next */
      }
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
  const handleGenderChange = (value: string) => {
    setFormData(prev => ({ ...prev, gender: value }));
    if (error) setError(null);
  };
  // eslint-disable-next-line complexity
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();    
    const validationError = validateForm(formData);
    if (validationError) {
      setError(validationError);
      return;
    }
    await createUser({
      variables: { input: formData },
    });
  };

  const isUsernameError = error?.code === 'USERNAME_EXISTS';
  const inputClassName = "w-full rounded-sm border border-gray-300 bg-gray-50 py-2 px-2 text-sm text-gray-900 placeholder:text-gray-500 focus:border-gray-400 focus:bg-white focus:outline-none";
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="bg-white py-8 px-8 shadow-sm border border-gray-300 rounded-sm">
          <div className="flex justify-center mb-4">
            <Image 
              src="/Instagram_logo.svg" 
              alt="Instagram" 
              width={175}
              height={48}
              className="h-12 w-auto"
              style={{ filter: 'brightness(0)' }}
            />
          </div>
          <div className="text-center mb-6 text-gray-600 text-base font-medium">
            <p>Sign up to see photos and videos from your friends</p>
          </div>

          <form className="space-y-2" onSubmit={handleSubmit}>
            <input id="email" name="email" type="email" required value={formData.email} onChange={handleInputChange} className={inputClassName} placeholder="Email Address" />
            <input id="password" name="password" type="password" required value={formData.password} onChange={handleInputChange} className={inputClassName} placeholder="Password" />
            <input id="fullName" name="fullName" type="text" required value={formData.fullName} onChange={handleInputChange} className={inputClassName} placeholder="Full Name" />
            <div>
              <input
                id="userName"
                name="userName"
                type="text"
                required
                value={formData.userName}
                onChange={handleInputChange}
                className={`w-full rounded-sm border py-2 px-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none ${isUsernameError ? 'border-red-500 bg-red-50 focus:border-red-500' : 'border-gray-300 bg-gray-50 focus:border-gray-400 focus:bg-white'}`}
                placeholder="Username"
              />
              {isUsernameError && <p className="mt-1 text-sm text-red-600">A user with that username already exists.</p>}
            </div>

            <div>
              <Select value={formData.gender} onValueChange={handleGenderChange}>
                <SelectTrigger className="w-full rounded-sm border border-gray-300 bg-gray-50 py-2 px-2 text-sm text-gray-900 focus:border-gray-400 focus:bg-white focus:outline-none">
                  <SelectValue placeholder="Select gender" className="text-gray-500" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MALE">Male</SelectItem>
                  <SelectItem value="FEMALE">Female</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="pt-2 text-xs text-gray-500 text-center leading-4 space-y-2">
              <p>
                People who use our service may have uploaded your contact information to Instagram.{' '}
                <Link href="/help/learn-more" className="text-blue-600 hover:text-blue-800">Learn More</Link>
              </p>
              <p>
                By signing up, you agree to our{' '}
                <Link href="/terms" className="text-blue-600 hover:text-blue-800">Terms</Link>, {' '}
                <Link href="/privacy" className="text-blue-600 hover:text-blue-800">Privacy Policy</Link> and {' '}
                <Link href="/cookies" className="text-blue-600 hover:text-blue-800">Cookies Policy</Link>.
              </p>
            </div>

            <div className="pt-4">
              <button type="submit" disabled={loading} className="w-full rounded-sm bg-blue-500 py-2 px-4 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300 disabled:cursor-not-allowed">{loading ? 'Signing up...' : 'Sign up'}</button>
            </div>

            {error && !isUsernameError && <div className="pt-2"><p className="text-sm text-red-600 text-center">{error.message}</p></div>}
          </form>
        </div>

        <div className="bg-white py-4 px-8 shadow-sm border border-gray-300 rounded-sm mt-2 text-center">
          <p className="text-sm text-gray-900">Have an account? <Link href="/login" className="text-blue-600 font-medium hover:text-blue-800">Log in</Link></p>
        </div>
      </div>
    </div>
  );
};
export default SignupPage;