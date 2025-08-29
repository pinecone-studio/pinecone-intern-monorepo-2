import { useStep } from '../providers/stepProvider';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isValid, z } from 'zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useState } from 'react';
import axios from 'axios';

export const Step2 = () => {
  const { setValues, values, setStep } = useStep();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  // Option 2: Modify the validation schema to ensure proper error order
  const schema = z
    .object({
      password: z
        .string()
        .min(1, { message: 'Enter your password' })
        .min(8, { message: 'Password must be at least 8 characters' })
        .refine(
          (data) => {
            // Only check format if length is already 8 or more
            if (data.length < 8) return true; // Let the .min(8) handle short passwords
            return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(data);
          },
          { message: 'Password must include uppercase, lowercase, and number' }
        ),
      confirmPassword: z.string().min(1, { message: 'Enter your confirm password' }),
    })
    .refine((data) => data.confirmPassword === data.password, {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    });
  const { register, handleSubmit, formState } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  return (
    <form
      onSubmit={handleSubmit(async (data: any) => {
        if (!values.email) {
          console.error('Email is missing from Step1!');
          return;
        }

        try {
          setLoading(true);
          const response = await axios.post(
            'http://localhost:4200/api/graphql',
            {
              query: `
              mutation CreateUser($email: String!, $password: String!) {
                createUser(input: { email: $email, password: $password })
              }
            `,
              variables: { email: values.email, password: data.password },
            },
            { headers: { 'Content-Type': 'application/json' } }
          );
          const result = response.data.data.createUser; // returns enum: SUCCESS or ERROR
          console.log('Mutation Result:', result);
          if (result === 'SUCCESS') {
            setStep(1);
            router.push('/'); // navigate to next step
            toast.success('User created successfully');
          } else {
            console.error('Failed to create user');
            toast.error('Failed to create user');
          }
        } catch (error: any) {
          console.error('Error creating user:', error.message);
          if (error.response) console.error(error.response.data);
          toast.error('Failed to create user');
        } finally {
          setLoading(false);
        }
      })}
    >
      <div className="w-[350px] h-[414px]  flex flex-col gap-6 items-center">
        <div className="flex flex-col items-center">
          <div>
            <img src={'/images/logo.png'} alt="logo" className="w-[100px]" />
          </div>
          <div className="text-[24px] font-semibold">Create password</div>
          <div className="text-[14px] text-center text-[#71717a]">Use a minimum of 10 characters, including uppercase letters, lowercase letters, and numbers</div>
        </div>
        <div className="w-full flex flex-col gap-2">
          <div className="flex flex-col gap-1 w-full ">
            <div className="text-[14px] flex items-center justify-between">
              <div>Password</div>
              <div
                className="cursor-pointer h-4 w-4"
                onClick={() => {
                  setShowPassword(!showPassword);
                }}
              >
                <img src={showPassword ? '/images/visible.png' : '/images/eyehide.png'} alt="eye" className="w-[16px] h-[16px]" />
              </div>
            </div>

            <input type={showPassword ? 'text' : 'password'} {...register('password')} placeholder="Enter your password" className="border-[1px] border-[#E4E4E7] h-9 w-full rounded-[6px] pl-4" />
            {formState.errors.password && <p className="text-red-500 text-[12px]">{formState.errors.password.message}</p>}
          </div>
          <div className="flex flex-col gap-1 w-full ">
            <div className="text-[14px] flex items-center justify-between">
              <div>Confirm password</div>
              <div className="cursor-pointer h-4 w-4" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                <img src={showConfirmPassword ? '/images/visible.png' : '/images/eyehide.png'} alt="eye" className="w-[16px] h-[16px]" />
              </div>
            </div>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              {...register('confirmPassword')}
              placeholder="Confirm your password"
              className="border-[1px] border-[#E4E4E7] h-9 w-full rounded-[6px] pl-4"
            />
            {formState.errors.confirmPassword && <p className="text-red-500 text-[12px]">{formState.errors.confirmPassword.message}</p>}
            {formState.errors.root && <p className="text-red-500 text-[12px]">{formState.errors.root?.message}</p>}
          </div>
          <button
            type="submit"
            disabled={loading || !formState.isValid}
            className={`w-full h-9 rounded-full text-white flex items-center justify-center hover:opacity-100 duration-200
              ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#E11D48] opacity-90'}
            `}
          >
            {loading ? 'Creating Account...' : 'Continue'}
          </button>
        </div>
      </div>
    </form>
  );
};
