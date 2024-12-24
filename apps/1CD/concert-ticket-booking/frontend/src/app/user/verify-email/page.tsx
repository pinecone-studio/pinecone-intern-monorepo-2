'use client';

import VerifyEmail from '@/app/user/verify-email/_components/VerifyEmail';
import React, { useState } from 'react';
import VerifyOtp from './_components/VerifyOtp';
import { useVerifyUserEmailMutation } from '@/generated';
import { toast } from 'sonner';

const VerifyEmailPage = () => {
  const [state, setState] = useState<number>(1);
  const [email, setEmail] = useState<string>('');
  const [verifyUserEmail, { loading }] = useVerifyUserEmailMutation({
    onCompleted: () => {
      toast.success('Successfully sent otp to email');
      setState(2);
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });
  return (
    <div data-cy="Verify-Email-Page">
      {state === 1 && <VerifyEmail setEmail={setEmail} verifyUserEmail={verifyUserEmail} loading={loading} />}
      {state === 2 && <VerifyOtp email={email} setState={setState} verifyUserEmail={verifyUserEmail} />}
    </div>
  );
};

export default VerifyEmailPage;
