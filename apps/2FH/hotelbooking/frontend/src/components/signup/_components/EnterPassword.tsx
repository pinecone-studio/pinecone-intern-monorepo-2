'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useState } from 'react';
import { useCreateUserMutation } from '@/generated';

import { LoadingSvg } from './assets/LoadingSvg';
import { useRouter } from 'next/navigation';
import { useOtpContext } from '@/components/providers';

export const EnterPassword = () => {
  const router = useRouter();
  const { email, password } = useOtpContext();
  const [createUser, { loading, error }] = useCreateUserMutation();
  const [values, setValues] = useState({ password, confirmPassword: '' });

  const handleCreateUser = async () => {
    try {
      const res = await createUser({ variables: { input: { email, password: values.password } } });
      toast.success(`${res.data?.createUser.email} user successfully created`);
      router.push('/login');
    } catch {
      toast.error('User create error');
    }
  };

  return (
    <div data-cy="Enter-Password-Component" className="flex flex-col items-center gap-4">
      <h3 className="text-2xl font-semibold opacity-80">Create password</h3>
      <p className="text-center opacity-50">Use at least 8 chars incl. upper, lower, numbers</p>

      <div className="w-[500px] flex flex-col gap-2">
        {['Password', 'Confirm password'].map((label, i) => (
          <div data-cy="Input-Password-Container" key={label}>
            <div className="opacity-80">{label}</div>
            <Input
              data-cy={`Enter-${i === 0 ? 'Password' : 'Confirm-Password'}-Input`}
              data-testid={`input-${i === 0 ? 'password' : 'confirm-password'}-input`}
              type="password"
              placeholder="Ex@mple123@example.com"
              className="w-full border rounded-sm px-2 py-1 placeholder:opacity-80"
              onChange={(e) => setValues((v) => ({ ...v, [i === 0 ? 'password' : 'confirmPassword']: e.target.value }))}
            />
          </div>
        ))}
        {error?.message && (
          <p data-cy="Create-User-Error-Message" className="text-red-500">
            {error.message}
          </p>
        )}

        <Button
          data-cy="Create-User-Button"
          data-testid="create-user-btn"
          disabled={values.password !== values.confirmPassword}
          className="w-full text-white bg-[#2563EB] hover:bg-[#2570EB]"
          onClick={handleCreateUser}
        >
          {loading ? <LoadingSvg /> : 'Continue'}
        </Button>
      </div>
    </div>
  );
};
